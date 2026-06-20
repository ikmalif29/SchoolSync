package com.example.students_service.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.students_service.dtos.GenericResponse;
import com.example.students_service.dtos.req.CreateStudentRequest;
import com.example.students_service.dtos.res.StudentDetailResponse;
import com.example.students_service.services.StudentService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/get-all-students")
    public ResponseEntity<?> getAllStudent(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {

        try {

            return ResponseEntity.ok(
                    GenericResponse.succes(
                            studentService.getAllStudent(page, size),
                            "Success"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/get-student-by-id/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(GenericResponse.succes(studentService.getStudentDetailById(id), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GenericResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/create-student")
    public ResponseEntity<?> createStudent(@RequestBody CreateStudentRequest request) throws Exception {
        try {
            return ResponseEntity.ok().body(GenericResponse.succes(studentService.createStudent(request), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/upload-photo/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPhoto(@PathVariable Long id, @RequestParam("photo") MultipartFile photo)
            throws Exception {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(studentService.uploadPhoto(id, photo), "Photo uploaded successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-student-by-nis/{nis}")
    public ResponseEntity<?> getStudentByNis(@PathVariable String nis) {
        try {
            return ResponseEntity.ok(GenericResponse.succes(studentService.getStudentByNis(nis), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete-student/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok().body(GenericResponse.succes(null, "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-student/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody CreateStudentRequest request) {
        try {
            return ResponseEntity.ok(
                    GenericResponse.succes(studentService.updateStudent(id, request), "Student updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> getStudentByEmail(@RequestParam String email) {
        try {
            // Mengubah penampung menjadi StudentDetailResponse
            StudentDetailResponse response = studentService.getStudentByEmail(email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}