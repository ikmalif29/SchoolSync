package com.example.teachers_service.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherResponse {

    private Long id;

    private String nip;

    private String fullName;

    private String gender;

    private String phoneNumber;

    private Long subjectId;

    private String email;

    private String address;

    private String status;
}