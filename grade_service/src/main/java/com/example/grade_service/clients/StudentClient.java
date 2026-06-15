package com.example.grade_service.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.grade_service.dtos.GenericResponse;
import com.example.grade_service.dtos.res.students.StudentResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentClient {

    private final RestClient restClient;

    public StudentResponse getStudent(Long id) {

        GenericResponse<StudentResponse> response = restClient.get()
                .uri("http://localhost:8081/api/students/get-student-by-id/" + id)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });

        return response.getData();
    }
}