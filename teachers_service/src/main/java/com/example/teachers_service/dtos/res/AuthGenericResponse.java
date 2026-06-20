package com.example.teachers_service.dtos.res;

import lombok.Data;

@Data
public class AuthGenericResponse {
    private AuthUserDetail data;
    private String message;

    @Data
    public static class AuthUserDetail {
        private Long id; // Ini ID utama yang akan kita ambil
        private String username;
        private String email;
        private String role;
        private String status;
    }
}