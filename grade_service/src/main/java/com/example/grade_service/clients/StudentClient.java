package com.example.grade_service.clients;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.example.grade_service.dtos.res.students.StudentResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentClient {

    private final RestClient restClient;

    public StudentResponse getStudent(Long id) {
        // Jika endpoint get-student-by-id membungkus pakai GenericResponse, biarkan ini tetap
        var response = restClient.get()
                .uri("http://localhost:8081/api/students/get-student-by-id/" + id)
                .retrieve()
                .body(new org.springframework.core.ParameterizedTypeReference<com.example.grade_service.dtos.GenericResponse<StudentResponse>>() {});
        return response.getData();
    }

    // PERBAIKAN DI METHOD SEARCH BY EMAIL
    public StudentResponse getStudentByEmail(String email) {
        // Langsung tembak ke StudentResponse.class karena data dari studentSvc tidak dibungkus GenericResponse
        StudentResponse student = restClient.get()
                .uri("http://localhost:8081/api/students/search?email=" + email)
                .retrieve()
                .body(StudentResponse.class); 
                
        if (student == null) {
            throw new RuntimeException("Respon data siswa kosong / tidak ditemukan");
        }
        
        return student;
    }
}