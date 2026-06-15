package com.example.students_service.dtos.res;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class StudentDetailResponse {

    private Long id;

    private String nis;

    private String fullName;

    private String gender;

    private LocalDate birthDate;

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
