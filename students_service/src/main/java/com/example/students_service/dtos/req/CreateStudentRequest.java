package com.example.students_service.dtos.req;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class CreateStudentRequest {

    @NotBlank
    private String nis;

    @NotBlank
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
}