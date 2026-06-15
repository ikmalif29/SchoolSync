package com.example.students_service.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class StudentResponse {

    private Long id;

    private String nis;

    private String fullName;

    private String gender;

    private String className;

    private String major;

    private String status;

    // private String photoBase64;
}
