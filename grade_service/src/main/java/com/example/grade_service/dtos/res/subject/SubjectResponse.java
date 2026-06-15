package com.example.grade_service.dtos.res.subject;

import lombok.Data;

@Data
public class SubjectResponse {

    private Long id;

    private String subjectCode;

    private String subjectName;

    private Integer creditHours;
}