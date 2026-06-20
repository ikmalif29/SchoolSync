package com.example.subject_service.clients; // Pastikan package-nya sama dengan yang di-scan

import com.example.subject_service.dtos.GenericResponse;
import com.example.subject_service.dtos.res.StudentDetailResponse;

import org.springframework.cloud.openfeign.FeignClient; // <-- Pastikan import ini ada
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "student-service", url = "${app.student-service.url:http://localhost:8081}")
public interface StudentClient {

    @GetMapping("/api/students/get-student-by-id/{id}")
    GenericResponse<StudentDetailResponse> getStudentById(@PathVariable("id") Long id);
}