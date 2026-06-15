package com.example.grade_service.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.grade_service.dtos.GenericResponse;
import com.example.grade_service.dtos.req.CreateGradeRequest;
import com.example.grade_service.services.GradeService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {
    private final GradeService gradeService;

    @PostMapping("/create-grade")
    public ResponseEntity<?> createGrade(@RequestBody CreateGradeRequest request) throws Exception {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(gradeService.createGrade(request), "Grade created Successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-all-grades")
    public ResponseEntity<?> getAllGrades(@RequestParam(defaultValue = "0") Integer page, @RequestParam(defaultValue = "10") Integer size) throws Exception {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(gradeService.getAllGrades(page, size), "Grades fetched Successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-grade-by-id/{id}")
    public ResponseEntity<?> getGradeById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(gradeService.getGradeById(id), "Grade fetched Successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-grade-by-student-id/{studentId}")
    public ResponseEntity<?> getGradeByStudentId(@PathVariable Long studentId) {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(gradeService.getGradeByStudentId(studentId),
                            "Grades fetched Successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-grade/{id}")
    public ResponseEntity<?> updateGrade(@PathVariable String id, @RequestBody CreateGradeRequest request)
            throws Exception {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(gradeService.updateGrade(Long.parseLong(id), request),
                            "Grade updated Successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/delete-grade/{id}")
    public ResponseEntity<?> deleteGrade(@PathVariable String id) {
        try {
            gradeService.deleteGrade(Long.parseLong(id));
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(null, "Grade deleted Successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
