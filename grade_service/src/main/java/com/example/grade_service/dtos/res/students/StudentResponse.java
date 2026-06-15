package com.example.grade_service.dtos.res.students;

import lombok.Data;

@Data
public class StudentResponse {

    private Long id;

    private String nis;

    private String fullName;

    private String gender;

    private String className;

    private String photoUrl;
}