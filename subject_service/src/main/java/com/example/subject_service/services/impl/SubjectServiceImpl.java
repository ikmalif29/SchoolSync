package com.example.subject_service.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.subject_service.dtos.req.CreateSubjectRequest;
import com.example.subject_service.dtos.res.PaginationResponse;
import com.example.subject_service.dtos.res.SubjectResponse;
import com.example.subject_service.models.Subject;
import com.example.subject_service.repositories.SubjectRepository;
import com.example.subject_service.services.SubjectService;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class SubjectServiceImpl implements SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public SubjectResponse createSubject(CreateSubjectRequest request) throws Exception {
        if (request.getSubjectCode() == null || request.getSubjectName() == null || request.getDescription() == null) {
            throw new Exception("Subject code, subject name and description are required");
        }

        boolean exists = subjectRepository.existsBySubjectCode(request.getSubjectCode());
        if (exists) {
            throw new Exception("Subject code already exists");
        }

        Subject subject = requestSubjectToSubject(request);
        subject.setStatus("ACTIVE");
        subject.setCreatedAt(LocalDateTime.now());
        subject.setUpdatedAt(LocalDateTime.now());

        Subject savedSubject = subjectRepository.save(subject);
        return subjectToResponseSubjectDto(savedSubject);
    }

    @Override
    public PaginationResponse<SubjectResponse> getAllTeacher(
            Integer page,
            Integer size) throws Exception {

        Pageable pageable = PageRequest.of(page, size);

        Page<Subject> subjectPage = subjectRepository.findAll(pageable);

        List<SubjectResponse> subjects = subjectPage.getContent()
                .stream()
                .map(this::subjectToResponseSubjectDto)
                .toList();

        return PaginationResponse.<SubjectResponse>builder()
                .content(subjects)
                .page(subjectPage.getNumber())
                .size(subjectPage.getSize())
                .totalElements(subjectPage.getTotalElements())
                .totalPages(subjectPage.getTotalPages())
                .last(subjectPage.isLast())
                .build();
    }

    @Override
    public SubjectResponse getSubjectById(Long id) throws Exception {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new Exception("Subject not found"));

        return subjectToResponseSubjectDto(subject);
    }

    @Override
    public SubjectResponse updateSubject(Long id, CreateSubjectRequest request) throws Exception {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new Exception("Subject not found"));

        if (request.getSubjectCode() == null || request.getSubjectCode().isBlank() || request.getSubjectName() == null
                || request.getSubjectName().isBlank() || request.getDescription() == null
                || request.getDescription().isBlank()) {
            throw new Exception("Subject code, subject name and description are required");
        }

        if (!subject.getSubjectCode().equals(request.getSubjectCode())) {
            boolean exists = subjectRepository.existsBySubjectCode(request.getSubjectCode());
            if (exists) {
                throw new Exception("Subject code already exists");
            }
        }

        subject.setSubjectCode(request.getSubjectCode());
        subject.setSubjectName(request.getSubjectName());
        subject.setDescription(request.getDescription());
        subject.setUpdatedAt(LocalDateTime.now());

        Subject updatedSubject = subjectRepository.save(subject);
        return subjectToResponseSubjectDto(updatedSubject);
    }

    @Override
    public void deleteSubject(Long id) throws Exception {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new Exception("Subject not found"));
        subjectRepository.delete(subject);
    }

    private SubjectResponse subjectToResponseSubjectDto(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .subjectCode(subject.getSubjectCode())
                .subjectName(subject.getSubjectName())
                .description(subject.getDescription())
                .status(subject.getStatus())
                .build();
    }

    private Subject requestSubjectToSubject(CreateSubjectRequest request) {
        return Subject.builder()
                .subjectCode(request.getSubjectCode())
                .subjectName(request.getSubjectName())
                .description(request.getDescription())
                .build();
    }
}
