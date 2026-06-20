package com.example.subject_service.scheduler;

import com.example.subject_service.clients.StudentClient;
import com.example.subject_service.clients.TeacherClient;
import com.example.subject_service.dtos.GenericResponse;
import com.example.subject_service.dtos.res.StudentDetailResponse;
import com.example.subject_service.dtos.res.TeacherResponse;
import com.example.subject_service.models.ClassSchedule;
import com.example.subject_service.repositories.ClassScheduleRepository;
import com.example.subject_service.services.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@Slf4j
public class ClassReminderScheduler {

    @Autowired
    private ClassScheduleRepository scheduleRepository;

    @Autowired
    private StudentClient studentClient;

    @Autowired
    private TeacherClient teacherClient;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 * * * * *") // Tetap berjalan setiap menit untuk mengecek antrean
    @org.springframework.transaction.annotation.Transactional(readOnly = true) // Jika kamu pakai opsi @Transactional tadi
    public void checkAndSendReminders() {
        LocalDateTime now = LocalDateTime.now();
        String currentDay = now.getDayOfWeek().toString().toUpperCase(); 
        
        // 🌟 KEMBALIKAN KE MODE PRODUKSI (Cari jadwal untuk 15 menit ke depan)
        LocalTime baseTargetTime = now.toLocalTime().plusMinutes(15);
        
        LocalTime startTime = baseTargetTime.withSecond(0).withNano(0);
        LocalTime endTime = baseTargetTime.withSecond(59).withNano(999999999);
        
        log.info("=========================================================================");
        log.info("🔍 [SCHEDULER PRODUCTION] Hari: {} | Mencari Kelas Jam: {} s.d {}", currentDay, startTime, endTime);
        
        List<ClassSchedule> upcomingClasses = scheduleRepository.findByDayOfWeekAndStartTimeBetween(currentDay, startTime, endTime);
        
        log.info("📊 [DIAGNOSTIK DB] Jumlah jadwal terdeteksi: {}", upcomingClasses.size());
        log.info("=========================================================================");

        if (upcomingClasses.isEmpty()) {
            return;
        }

        ObjectMapper mapper = new ObjectMapper();

        for (ClassSchedule schedule : upcomingClasses) {
            String subjectName = (schedule.getSubject() != null) ? schedule.getSubject().getSubjectName() : "Unknown Subject";
            log.info("🚀 [PROSES JADWAL] Mengolah Jadwal ID: {}, Mapel: {}", schedule.getId(), subjectName);

            // 1. PENGIRIMAN GURU
            if (schedule.getTeacherId() != null) {
                try {
                    log.info("☎️ [FEIGN] Menghubungi Teacher Service untuk ID: {}", schedule.getTeacherId());
                    GenericResponse<TeacherResponse> teacherCall = teacherClient.getTeacherById(schedule.getTeacherId());
                    
                    if (teacherCall != null && teacherCall.getData() != null) {
                        TeacherResponse teacher = mapper.convertValue(teacherCall.getData(), TeacherResponse.class);
                        if (teacher != null && teacher.getEmail() != null) {
                            emailService.sendReminderEmail(
                                    teacher.getEmail(), 
                                    teacher.getFullName(), 
                                    subjectName + " (Sebagai Pengajar)", 
                                    schedule.getStartTime()
                            );
                            log.info("📩 [SUCCESS GURU] Email terkirim ke: {}", teacher.getEmail());
                        }
                    } else {
                        log.warn("⚠️ [WARN GURU] Response data guru kosong dari Teacher Service");
                    }
                } catch (Exception e) {
                    log.error("❌ [ERROR GURU] Gagal memproses data Guru: {}", e.getMessage());
                }
            }

            // 2. PENGIRIMAN SISWA
            if (schedule.getStudentIds() != null && !schedule.getStudentIds().isEmpty()) {
                for (Long studentId : schedule.getStudentIds()) {
                    try {
                        log.info("☎️ [FEIGN] Menghubungi Student Service untuk ID: {}", studentId);
                        GenericResponse<StudentDetailResponse> response = studentClient.getStudentById(studentId);
                        
                        if (response != null && response.getData() != null) {
                            StudentDetailResponse student = response.getData();
                            if (student.getEmail() != null) {
                                emailService.sendReminderEmail(
                                        student.getEmail(), 
                                        student.getFullName(), 
                                        subjectName, 
                                        schedule.getStartTime()
                                );
                                log.info("📩 [SUCCESS SISWA] Email terkirim ke: {}", student.getEmail());
                            }
                        }
                    } catch (Exception e) {
                        log.error("❌ [ERROR SISWA] Gagal memproses data Siswa ID {}: {}", studentId, e.getMessage());
                    }
                }
            }
        }
    }
}