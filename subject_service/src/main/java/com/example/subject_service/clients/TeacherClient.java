package com.example.subject_service.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.example.subject_service.dtos.GenericResponse;
import com.example.subject_service.dtos.res.TeacherResponse;

@FeignClient(name = "teacher-service", url = "${app.teacher-service.url:http://localhost:8082}")
public interface TeacherClient {

    // Sesuaikan dengan nama path yang ada di TeacherContoller kamu tadi
    @GetMapping("/api/teacher/get-teacher-by-id/{id}")
    GenericResponse<TeacherResponse> getTeacherById(@PathVariable("id") Long id);
}