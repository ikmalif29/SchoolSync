package com.example.students_service.services;

import org.springframework.web.multipart.MultipartFile;

import com.example.students_service.dtos.req.CreateStudentRequest;
import com.example.students_service.dtos.res.PaginationResponse;
import com.example.students_service.dtos.res.StudentResponse;

public interface StudentService {
    StudentResponse createStudent(CreateStudentRequest request) throws Exception;
    StudentResponse uploadPhoto(Long id,MultipartFile photo) throws Exception;
    StudentResponse getStudentByNis(String nis) throws Exception;
    StudentResponse updateStudent(Long id, CreateStudentRequest request) throws Exception;
    void deleteStudent(Long id) throws Exception;
    StudentResponse getStudentById(Long id) throws Exception;
    PaginationResponse<StudentResponse> getAllStudent(
        Integer page,
        Integer size) throws Exception;
}
