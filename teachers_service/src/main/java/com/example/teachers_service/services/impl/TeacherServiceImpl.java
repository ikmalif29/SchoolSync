package com.example.teachers_service.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.teachers_service.dtos.req.CreateTeacherRequest;
import com.example.teachers_service.dtos.res.PaginationResponse;
import com.example.teachers_service.dtos.res.TeacherResponse;
import com.example.teachers_service.models.Teacher;
import com.example.teachers_service.repositories.TeacherRepository;
import com.example.teachers_service.services.TeacherService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;


@Service
public class TeacherServiceImpl implements TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public TeacherResponse createTeacher(CreateTeacherRequest request) throws Exception {
        if (request.getNip() == null || request.getFullName() == null || request.getGender() == null
                || request.getPhoneNumber() == null || request.getEmail() == null || request.getAddress() == null
                || request.getSubjectId() == null) {
            throw new Exception("NIP, Full Name, Gender, Phone Number, Email, and Address must not be null");
        }

        boolean isExists = teacherRepository.existsByNip(request.getNip());
        if (isExists) {
            throw new Exception("NIP already exists");
        }

        Teacher teacher = requestTeacherToTeacher(request);
        teacher.setStatus("ACTIVE");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        Teacher savedTeacher = teacherRepository.save(teacher);
        return teacherToResponseTeacherDto(savedTeacher);
    }

    @Override
    public TeacherResponse getTeacherById(Long id) throws Exception {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new Exception("Teacher not found"));
        
        return teacherToResponseTeacherDto(teacher);
    }

    @Override
    public PaginationResponse<TeacherResponse> getAllTeacher(Integer page, Integer size) throws Exception {
        Pageable pageable = PageRequest.of(page, size);
        Page<Teacher> teachers = teacherRepository.findAll(pageable);
        List<TeacherResponse> teacherResponseList = teachers.getContent().stream().map(this::teacherToResponseTeacherDto).toList();

        return PaginationResponse.<TeacherResponse>builder()
                .content(teacherResponseList)
                .page(teachers.getNumber())
                .size(teachers.getSize())
                .totalElements(teachers.getTotalElements())
                .totalPages(teachers.getTotalPages())
                .last(teachers.isLast())
                .build();
    }

    @Override
    public TeacherResponse getTeacherByNip(String nip) throws Exception {
        Teacher teacher = teacherRepository.findByNip(nip).orElseThrow(() -> new Exception("NIP not found"));

        return teacherToResponseTeacherDto(teacher);
    }

    @Override
    public TeacherResponse updateTeacher(Long id, CreateTeacherRequest request) throws Exception {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new Exception("Teacher not found"));
        if (request.getNip() == null || request.getNip().isBlank() ||
                request.getFullName() == null || request.getFullName().isBlank() ||
                request.getGender() == null || request.getGender().isBlank() ||
                request.getPhoneNumber() == null || request.getPhoneNumber().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getAddress() == null || request.getAddress().isBlank() ||
                request.getSubjectId() == null) {

            throw new Exception("Semua field wajib diisi");
        }

        if (!teacher.getNip().equals(request.getNip())) {
            boolean isExists = teacherRepository.existsByNip(request.getNip());
            if (isExists) {
                throw new Exception("NIP already exists");
            }
        }

        teacher.setNip(request.getNip());
        teacher.setFullName(request.getFullName());
        teacher.setGender(request.getGender());
        teacher.setPhoneNumber(request.getPhoneNumber());
        teacher.setEmail(request.getEmail());
        teacher.setSubjectId(request.getSubjectId());
        teacher.setAddress(request.getAddress());
        teacher.setUpdatedAt(LocalDateTime.now());

        Teacher updatedTeacher = teacherRepository.save(teacher);
        return teacherToResponseTeacherDto(updatedTeacher);
    }

    @Override
    public void deleteTeacher(Long id) throws Exception {
        Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new Exception("Teacher not found"));

        teacherRepository.delete(teacher);
    }

    private TeacherResponse teacherToResponseTeacherDto(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId())
                .nip(teacher.getNip())
                .fullName(teacher.getFullName())
                .gender(teacher.getGender())
                .phoneNumber(teacher.getPhoneNumber())
                .email(teacher.getEmail())
                .address(teacher.getAddress())
                .subjectId(teacher.getSubjectId())
                .status(teacher.getStatus())
                .build();
    }

    private Teacher requestTeacherToTeacher(CreateTeacherRequest request) {
        return Teacher.builder()
                .nip(request.getNip())
                .fullName(request.getFullName())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .subjectId(request.getSubjectId())
                .address(request.getAddress())
                .build();
    }
}
