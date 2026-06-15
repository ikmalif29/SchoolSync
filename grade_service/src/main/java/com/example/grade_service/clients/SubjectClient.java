package com.example.grade_service.clients;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.example.grade_service.dtos.GenericResponse;
import com.example.grade_service.dtos.res.subject.SubjectResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectClient {

    private final RestClient restClient;

    public SubjectResponse getSubject(Long id) {

        GenericResponse<SubjectResponse> response = restClient.get()
                .uri("http://localhost:8083/api/subject/get-subject-by-id/" + id)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });

        return response.getData();
    }
}