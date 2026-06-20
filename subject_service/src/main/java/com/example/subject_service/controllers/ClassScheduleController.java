package com.example.subject_service.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.subject_service.dtos.GenericResponse;
import com.example.subject_service.dtos.req.CreateScheduleRequest;
import com.example.subject_service.dtos.res.PaginationResponse;
import com.example.subject_service.dtos.res.ScheduleResponse;
import com.example.subject_service.services.ClassScheduleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ClassScheduleController {

    private final ClassScheduleService classScheduleService;

    @PostMapping("/create")
    public ResponseEntity<?> createSchedule(@RequestBody CreateScheduleRequest request) {
        try {
            ScheduleResponse response = classScheduleService.createSchedule(request);
            return ResponseEntity.ok(
                    GenericResponse.succes(response, "Jadwal kelas berhasil dibuat"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    GenericResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/student/{studentId}/today")
    public ResponseEntity<?> getStudentScheduleToday(
            @PathVariable Long studentId,
            @RequestParam String dayOfWeek) {
        try {
            List<ScheduleResponse> responseList = classScheduleService.getStudentScheduleToday(studentId, dayOfWeek);
            return ResponseEntity.ok(
                    GenericResponse.succes(responseList, "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    GenericResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/update-schedule/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody CreateScheduleRequest request) {
        try {
            return ResponseEntity.ok(GenericResponse.succes(classScheduleService.updateSchedule(id, request),
                    "Jadwal berhasil diperbarui"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GenericResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/delete-schedule/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        try {
            classScheduleService.deleteSchedule(id);
            return ResponseEntity.ok(GenericResponse.succes(null, "Jadwal berhasil dihapus"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GenericResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/get-all")
    public ResponseEntity<?> getAllSchedules(
            @RequestParam(value = "dayOfWeek", required = false) String dayOfWeek,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size) {
        try {
            // Memanggil service yang sekarang mengembalikan PaginationResponse
            PaginationResponse<ScheduleResponse> paginationData = classScheduleService.getAllSchedules(dayOfWeek, page,
                    size);

            return ResponseEntity.ok(GenericResponse.succes(paginationData, "Berhasil memuat semua data jadwal"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getScheduleByTeacherId(@PathVariable Long teacherId) {
        try {
            List<ScheduleResponse> responseList = classScheduleService.getScheduleByTeacherId(teacherId);
            return ResponseEntity.ok(
                    GenericResponse.succes(responseList, "Berhasil memuat jadwal mengajar guru"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    GenericResponse.error(e.getMessage()));
        }
    }
}