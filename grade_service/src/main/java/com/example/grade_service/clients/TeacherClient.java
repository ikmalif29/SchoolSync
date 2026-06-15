package com.example.grade_service.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.grade_service.dtos.GenericResponse;
import com.example.grade_service.dtos.res.teacher.TeacherResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeacherClient {

    private final RestClient restClient;

    public TeacherResponse getTeacher(Long id) {

        GenericResponse<TeacherResponse> response = restClient.get()
                .uri("http://localhost:8082/api/teacher/get-teacher-by-id/" + id)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });

        return response.getData();
    }
}