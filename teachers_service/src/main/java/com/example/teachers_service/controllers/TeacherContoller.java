package com.example.teachers_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.teachers_service.dtos.GenericResponse;
import com.example.teachers_service.dtos.req.CreateTeacherRequest;
import com.example.teachers_service.services.TeacherService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherContoller {

    private final TeacherService teacherService;

    @PostMapping("/create-teacher")
    public ResponseEntity<?> createTeacher(@RequestBody CreateTeacherRequest request) throws Exception {
        try {
            System.out.println(request);
            return ResponseEntity.ok().body(GenericResponse.succes(teacherService.createTeacher(request), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-all-teacher")
    public ResponseEntity<?> getAllTeacher(@RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        try {
            return ResponseEntity.ok(GenericResponse.succes(teacherService.getAllTeacher(page, size), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-teacher-by-id/{id}")
    public ResponseEntity<?> getTeacherById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(GenericResponse.succes(teacherService.getTeacherById(id), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/get-teacher-by-nip/{nip}")
    public ResponseEntity<?> getTeacherByNip(@PathVariable String nip) {
        try {
            return ResponseEntity.ok(GenericResponse.succes(teacherService.getTeacherByNip(nip), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-teacher/{id}")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id,@RequestBody CreateTeacherRequest request) {
        try {
            return ResponseEntity.ok(GenericResponse.succes(teacherService.updateTeacher(id, request), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete-teacher/{id}")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        try {
            teacherService.deleteTeacher(id);
            return ResponseEntity.ok(GenericResponse.succes(null, "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-teacher-by-email/{email}")
    public ResponseEntity<?> getTeacherByEmail(@PathVariable String email) {
        try {
            return ResponseEntity.ok(GenericResponse.succes(teacherService.getTeacherByEmail(email), "Success"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }     
}
