package com.example.grade_service.services;

import java.util.List;

import com.example.grade_service.dtos.req.CreateGradeRequest;
import com.example.grade_service.dtos.res.GradeResponse;
import com.example.grade_service.dtos.res.PaginationResponse;

public interface GradeService {

    GradeResponse createGrade(CreateGradeRequest request) throws Exception;

    PaginationResponse<GradeResponse> getAllGrades(
        Integer page,
        Integer size) throws Exception;

    GradeResponse getGradeById(Long id) throws Exception;

    List<GradeResponse> getGradeByStudentId(Long studentId) throws Exception;

    GradeResponse updateGrade(Long id, CreateGradeRequest request) throws Exception;

    void deleteGrade(Long id) throws Exception;

    byte[] generateGradeExcel(String email) throws Exception;
}