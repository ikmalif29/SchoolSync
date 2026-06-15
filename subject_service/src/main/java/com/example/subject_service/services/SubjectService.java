package com.example.subject_service.services;

import com.example.subject_service.dtos.req.CreateSubjectRequest;
import com.example.subject_service.dtos.res.PaginationResponse;
import com.example.subject_service.dtos.res.SubjectResponse;

public interface SubjectService {

    SubjectResponse createSubject(CreateSubjectRequest request) throws Exception;

    PaginationResponse<SubjectResponse> getAllTeacher(Integer page, Integer size) throws Exception;

    SubjectResponse getSubjectById(Long id) throws Exception;

    SubjectResponse updateSubject(Long id, CreateSubjectRequest request) throws Exception;

    void deleteSubject(Long id) throws Exception;
}