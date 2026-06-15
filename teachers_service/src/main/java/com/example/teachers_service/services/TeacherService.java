package com.example.teachers_service.services;

import com.example.teachers_service.dtos.req.CreateTeacherRequest;
import com.example.teachers_service.dtos.res.PaginationResponse;
import com.example.teachers_service.dtos.res.TeacherResponse;

public interface TeacherService {
    TeacherResponse createTeacher(CreateTeacherRequest request) throws Exception;
    PaginationResponse<TeacherResponse> getAllTeacher(Integer page, Integer size) throws Exception;
    TeacherResponse getTeacherByNip(String nip) throws Exception;
    TeacherResponse updateTeacher(Long id, CreateTeacherRequest request) throws Exception;
    TeacherResponse getTeacherById(Long id) throws Exception;
    void deleteTeacher(Long id) throws Exception;
}