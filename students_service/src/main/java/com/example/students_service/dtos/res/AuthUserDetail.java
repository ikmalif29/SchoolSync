package com.example.students_service.dtos.res;

import lombok.Data;

@Data
public class AuthUserDetail {
    private Long id; 
    private String username;
    private String email;
    private String role;
    private String status;
}