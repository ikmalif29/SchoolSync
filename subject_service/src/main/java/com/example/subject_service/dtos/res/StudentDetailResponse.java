package com.example.subject_service.dtos.res;

import lombok.Data;

@Data
public class StudentDetailResponse {
    private Long id;
    private String fullName;
    private String email;
}