package com.example.grade_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenericResponse<T> {
    private T data;
    private String message;

    public static <T> GenericResponse<T> succes(T data, String message) {
        return GenericResponse.<T>builder()
                .data(data)
                .message(message)
                .build();
    }

    public static <T> GenericResponse<T> error(String message) {
        return GenericResponse.<T>builder()
                .message(message)
                .build();
    }
}