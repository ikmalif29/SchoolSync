package com.example.subject_service.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeacherResponse {
    private Long id;
    private String nip;
    private String fullName; // Menggunakan fullName sesuai dengan Opsi A
    private String gender;
    private String phoneNumber;
    private String email;
    private Long subjectId;
    private String address;
    private String status;
}