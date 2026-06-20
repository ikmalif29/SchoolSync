package com.example.students_service.dtos.req;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class RegisterAuthPayload {
    private String username;
    private String password;
    private String email;
    private String role; 
}