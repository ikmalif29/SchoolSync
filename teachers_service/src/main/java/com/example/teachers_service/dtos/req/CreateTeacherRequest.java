package com.example.teachers_service.dtos.req;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTeacherRequest {

    private String nip;

    private String fullName;

    private String gender;

    private String phoneNumber;

    private Long subjectId;

    private String email;

    private String address;
}