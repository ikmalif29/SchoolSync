package com.example.subject_service.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.subject_service.dtos.GenericResponse;
import com.example.subject_service.dtos.req.CreateSubjectRequest;
import com.example.subject_service.services.SubjectService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/subject")
@RequiredArgsConstructor
public class SubjectController {
    private final SubjectService subjectService;

    @PostMapping("/create-subject")
    public ResponseEntity<?> createSubject(@RequestBody CreateSubjectRequest request) {
        try {
            return ResponseEntity.ok().body(
                    GenericResponse.succes(subjectService.createSubject(request), "Subject created successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-all-subjects")
    public ResponseEntity<?> getAllSubject(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(subjectService.getAllTeacher(page, size),
                            "Subjects retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-subject-by-id/{id}")
    public ResponseEntity<?> getSubjectById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(subjectService.getSubjectById(id), "Subject retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-subject/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable String id,@RequestBody CreateSubjectRequest request) {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(subjectService.updateSubject(Long.parseLong(id), request),
                            "Subject updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete-subject/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable String id) {
        try {
            subjectService.deleteSubject(Long.parseLong(id));
            return ResponseEntity.ok().body("Subject deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
