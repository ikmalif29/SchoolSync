package com.example.students_service.dtos.res;

import lombok.Data;

@Data
public class AuthGenericResponse {
    private AuthUserDetail data; 
    private String message;

    // Static inner class diletakkan di dalam file yang sama
    @Data
    public static class AuthUserDetail {
        private Long id; 
        private String username;
        private String email;
        private String role;
        private String status;
    }
}