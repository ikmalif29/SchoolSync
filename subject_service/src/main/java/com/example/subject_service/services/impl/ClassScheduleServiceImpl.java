package com.example.subject_service.services.impl;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

// 🌟 PERBAIKAN IMPORT: Diambil dari package domain yang tepat untuk Paginasi JPA
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.subject_service.clients.TeacherClient;
import com.example.subject_service.dtos.req.CreateScheduleRequest;
import com.example.subject_service.dtos.res.PaginationResponse;
import com.example.subject_service.dtos.res.ScheduleResponse;
import com.example.subject_service.dtos.res.TeacherResponse;
import com.example.subject_service.models.ClassSchedule;
import com.example.subject_service.models.Subject;
import com.example.subject_service.repositories.ClassScheduleRepository;
import com.example.subject_service.repositories.SubjectRepository;
import com.example.subject_service.services.ClassScheduleService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClassScheduleServiceImpl implements ClassScheduleService {

    private final ClassScheduleRepository scheduleRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherClient teacherClient;

    @Override
    public ScheduleResponse createSchedule(CreateScheduleRequest request) throws Exception {
        // 1. Validasi Hari
        String dayInput = request.getDayOfWeek().toUpperCase();
        try {
            DayOfWeek.valueOf(dayInput);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Nama hari tidak valid! Gunakan format bahasa Inggris (e.g., MONDAY)");
        }

        // 2. Cari data Subject
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Mata pelajaran (Subject) tidak ditemukan"));

        // 3. Validasi Keberadaan Guru di Teacher Service
        try {
            var teacherCheck = teacherClient.getTeacherById(request.getTeacherId());
            if (teacherCheck == null || teacherCheck.getData() == null) {
                throw new RuntimeException("Data Guru tidak ditemukan di Teacher Service.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Gagal validasi Guru! " + e.getMessage());
        }

        LocalTime parsedTime = LocalTime.parse(request.getStartTime());

        // 4. Validasi Jam Operasional Sekolah (07:00 s.d. 16:00)
        if (parsedTime.isBefore(LocalTime.of(7, 0)) || parsedTime.isAfter(LocalTime.of(16, 0))) {
            throw new RuntimeException(
                    "Gagal membuat jadwal! Jam sekolah hanya diperbolehkan antara pukul 07:00 hingga 16:00.");
        }

        // 5. VALIDASI BENTROK GURU (Langsung Cek ke Database)
        boolean isTeacherBusy = scheduleRepository.existsByTeacherIdAndDayOfWeekAndStartTime(
                request.getTeacherId(), dayInput, parsedTime);
        if (isTeacherBusy) {
            throw new RuntimeException("Gagal! Guru dengan ID " + request.getTeacherId() +
                    " sudah memiliki jadwal mengajar di kelas lain pada hari " + dayInput + " pukul " + parsedTime);
        }

        // 6. Validasi Bentrok Siswa
        List<ClassSchedule> existingSchedulesOnDay = scheduleRepository.findAll().stream()
                .filter(s -> s.getDayOfWeek().equalsIgnoreCase(dayInput))
                .toList();

        for (Long studentId : request.getStudentIds()) {
            for (ClassSchedule existingSchedule : existingSchedulesOnDay) {
                if (existingSchedule.getStartTime().equals(parsedTime)) {
                    if (existingSchedule.getStudentIds().contains(studentId)) {
                        throw new RuntimeException("Gagal! Siswa dengan ID " + studentId +
                                " sudah memiliki jadwal '" + existingSchedule.getSubject().getSubjectName() +
                                "' pada hari " + dayInput + " pukul " + parsedTime);
                    }
                }
            }
        }

        // 7. Jika lolos semua validasi, simpan ke database
        ClassSchedule classSchedule = ClassSchedule.builder()
                .subject(subject)
                .teacherId(request.getTeacherId())
                .dayOfWeek(dayInput)
                .startTime(parsedTime)
                .studentIds(request.getStudentIds())
                .build();

        ClassSchedule savedSchedule = scheduleRepository.save(classSchedule);

        return convertToResponseDto(savedSchedule);
    }

    @Override
    public List<ScheduleResponse> getStudentScheduleToday(Long studentId, String dayOfWeek) {
        List<ClassSchedule> schedules = scheduleRepository.findByStudentIdsContainingAndDayOfWeek(studentId,
                dayOfWeek.toUpperCase());
        return schedules.stream().map(this::convertToResponseDto).toList();
    }

    @Override
    public ScheduleResponse updateSchedule(Long id, CreateScheduleRequest request) throws Exception {
        // 1. Cari data jadwal lama yang mau diedit
        ClassSchedule existingSchedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jadwal dengan ID " + id + " tidak ditemukan"));

        // 2. Validasi Hari
        String dayInput = request.getDayOfWeek().toUpperCase();
        try {
            DayOfWeek.valueOf(dayInput);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Nama hari tidak valid! Gunakan format bahasa Inggris (e.g., MONDAY)");
        }

        // 3. Cari data Subject baru (jika subject-nya ikut diganti)
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Mata pelajaran (Subject) tidak ditemukan"));

        // 4. Validasi & Cek keberadaan Teacher di Teacher Service via Feign Client
        try {
            var teacherCheck = teacherClient.getTeacherById(request.getTeacherId());
            if (teacherCheck == null || teacherCheck.getData() == null) {
                throw new RuntimeException("Data Guru tidak ditemukan di Teacher Service.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Gagal validasi Guru! " + e.getMessage());
        }

        LocalTime parsedTime = LocalTime.parse(request.getStartTime());

        // 5. Validasi Jam Operasional Sekolah (07:00 s.d. 16:00)
        if (parsedTime.isBefore(LocalTime.of(7, 0)) || parsedTime.isAfter(LocalTime.of(16, 0))) {
            throw new RuntimeException(
                    "Gagal mengupdate jadwal! Jam sekolah hanya diperbolehkan antara pukul 07:00 hingga 16:00.");
        }

        // 6. VALIDASI BENTROK GURU
        boolean isTeacherBusy = scheduleRepository.existsByTeacherIdAndDayOfWeekAndStartTimeAndIdNot(
                request.getTeacherId(), dayInput, parsedTime, id);
        if (isTeacherBusy) {
            throw new RuntimeException("Gagal! Guru dengan ID " + request.getTeacherId() +
                    " sudah memiliki jadwal mengajar di kelas lain pada hari " + dayInput + " pukul " + parsedTime);
        }

        // 7. VALIDASI BENTROK GURU & SISWA
        List<ClassSchedule> existingSchedulesOnDay = scheduleRepository.findAll().stream()
                .filter(s -> s.getDayOfWeek().equalsIgnoreCase(dayInput) && !s.getId().equals(id))
                .toList();

        for (Long studentId : request.getStudentIds()) {
            for (ClassSchedule otherSchedule : existingSchedulesOnDay) {
                if (otherSchedule.getStartTime().equals(parsedTime)) {
                    if (otherSchedule.getStudentIds().contains(studentId)) {
                        throw new RuntimeException("Gagal! Siswa dengan ID " + studentId +
                                " sudah memiliki jadwal '" + otherSchedule.getSubject().getSubjectName() +
                                "' pada hari " + dayInput + " pukul " + parsedTime);
                    }
                }
            }
        }

        // 8. Jika lolos semua validasi, update data objek lama
        existingSchedule.setSubject(subject);
        existingSchedule.setTeacherId(request.getTeacherId());
        existingSchedule.setDayOfWeek(dayInput);
        existingSchedule.setStartTime(parsedTime);
        existingSchedule.setStudentIds(request.getStudentIds());

        // 9. Simpan perubahan
        ClassSchedule updatedSchedule = scheduleRepository.save(existingSchedule);

        return convertToResponseDto(updatedSchedule);
    }
    
    @Override
    public List<ScheduleResponse> getScheduleByTeacherId(Long teacherId) throws Exception {
        // 1. Ambil semua data jadwal berdasarkan ID Guru dari repository
        List<ClassSchedule> schedules = scheduleRepository.findByTeacherId(teacherId);
        
        // 2. Map hasilnya ke Response DTO memanfaatkan convertToResponseDto bawaanmu
        return schedules.stream()
                .map(this::convertToResponseDto)
                .toList();
    }

    @Override
    public PaginationResponse<ScheduleResponse> getAllSchedules(String dayOfWeek, Integer page, Integer size)
            throws Exception {
        // 1. Ambil data terpaginasi dari database
        Pageable pageable = PageRequest.of(page, size, Sort.by("startTime").ascending());
        Page<ClassSchedule> schedulesPage;

        if (dayOfWeek != null && !dayOfWeek.isBlank()) {
            schedulesPage = scheduleRepository.findByDayOfWeek(dayOfWeek.toUpperCase(), pageable);
        } else {
            schedulesPage = scheduleRepository.findAll(pageable);
        }

        // 2. Konversi List entitas di dalam Page menjadi List DTO Response
        List<ScheduleResponse> dtoList = schedulesPage.getContent()
                .stream()
                .map(this::convertToResponseDto)
                .toList();

        // 3. Bungkus ke dalam PaginationResponse milikmu menggunakan Builder Lombok
        return PaginationResponse.<ScheduleResponse>builder()
                .content(dtoList)
                .page(schedulesPage.getNumber())
                .size(schedulesPage.getSize())
                .totalElements(schedulesPage.getTotalElements())
                .totalPages(schedulesPage.getTotalPages())
                .last(schedulesPage.isLast())
                .build();
    }

    @Override
    public void deleteSchedule(Long id) throws Exception {
        ClassSchedule classSchedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jadwal dengan ID " + id + " tidak ditemukan"));

        scheduleRepository.delete(classSchedule);
    }

    private ScheduleResponse convertToResponseDto(ClassSchedule schedule) {
        String teacherName = "Unknown Teacher";
        if (schedule.getTeacherId() != null) {
            try {
                // 1. Ambil response dari Feign Client
                var response = teacherClient.getTeacherById(schedule.getTeacherId());
    
                if (response != null && response.getData() != null) {
                    // 2. Mengubah LinkedHashMap bawaan Jackson menjadi DTO objek TeacherResponse
                    ObjectMapper mapper = new ObjectMapper();
                    TeacherResponse teacher = mapper.convertValue(response.getData(), TeacherResponse.class);
    
                    if (teacher != null && teacher.getFullName() != null) {
                        teacherName = teacher.getFullName();
                    }
                }
            } catch (Exception e) {
                System.out.println("====== ERROR FEIGN CLIENT ======");
                System.out.println("Pesan Error: " + e.getMessage());
                e.printStackTrace();
                System.out.println("================================");
                teacherName = "Gagal memuat nama guru (Error)";
            }
        }
    
        // Mengembalikan response lengkap dengan id teacher-nya
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .subjectId(schedule.getSubject().getId())
                .subjectName(schedule.getSubject().getSubjectName())
                .teacherId(schedule.getTeacherId()) // 🌟 SEKARANG TERBACA DI SINI
                .teacherName(teacherName)
                .dayOfWeek(schedule.getDayOfWeek())
                .startTime(schedule.getStartTime())
                .studentIds(schedule.getStudentIds())
                .build();
    }
}