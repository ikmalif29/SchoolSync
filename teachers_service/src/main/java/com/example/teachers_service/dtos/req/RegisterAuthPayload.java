package com.example.teachers_service.dtos.req;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterAuthPayload {
    private String username;
    private String password;
    private String email;
    private String role; // Nanti diisi "TEACHER"
}