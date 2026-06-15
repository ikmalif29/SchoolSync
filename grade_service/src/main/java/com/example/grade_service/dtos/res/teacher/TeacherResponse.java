package com.example.grade_service.dtos.res.teacher;

import lombok.Data;

@Data
public class TeacherResponse {

    private Long id;

    private String nip;

    private String fullName;

    private String gender;

    private String phoneNumber;
}