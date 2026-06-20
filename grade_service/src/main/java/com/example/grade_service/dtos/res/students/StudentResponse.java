package com.example.grade_service.dtos.res.students;

import lombok.Data;

@Data
public class StudentResponse {
    private Long id;
    private String nis;
    private String fullName;
    private String gender;
    private String birthDate; // Ubah ke LocalDate sesuai dengan asal service
    private String phoneNumber;
    private String email;
    private String address;
    private String className;
    private String major;
    private String parentName;
    private String parentPhone;
    private String status;
    private String photoBase64;
}