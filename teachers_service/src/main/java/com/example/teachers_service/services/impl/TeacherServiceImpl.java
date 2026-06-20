package com.example.teachers_service.services.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.security.SecureRandom;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.teachers_service.dtos.req.CreateTeacherRequest;
import com.example.teachers_service.dtos.req.RegisterAuthPayload;
import com.example.teachers_service.dtos.res.PaginationResponse;
import com.example.teachers_service.dtos.res.TeacherResponse;
import com.example.teachers_service.dtos.res.AuthGenericResponse;
import com.example.teachers_service.models.Teacher;
import com.example.teachers_service.repositories.TeacherRepository;
import com.example.teachers_service.services.TeacherService;
import com.example.teachers_service.services.EmailService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final EmailService emailService;
    private final RestTemplate restTemplate = new RestTemplate();

    // URL langsung ke Auth Service port 8086
    private final String AUTH_SERVICE_URL = "http://localhost:8086/auth/register";

    @Override
    public TeacherResponse createTeacher(CreateTeacherRequest request) throws Exception {
        // 1. Validasi Semua Field Wajib
        if (request.getNip() == null || request.getNip().isBlank() ||
                request.getFullName() == null || request.getFullName().isBlank() ||
                request.getGender() == null || request.getGender().isBlank() ||
                request.getPhoneNumber() == null || request.getPhoneNumber().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank() ||
                request.getAddress() == null || request.getAddress().isBlank() ||
                request.getSubjectId() == null) {
            throw new Exception("Semua field termasuk Email dan Subject ID wajib diisi");
        }

        // Validasi keunikan NIP & Email lokal
        if (teacherRepository.existsByNip(request.getNip())) {
            throw new Exception("NIP already exists");
        }
        if (teacherRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email sudah digunakan oleh guru lain");
        }

        // 2. Generate Password Sementara untuk Guru
        String rawRandomPassword = generateRandomPassword();

        // 3. Lempar Payload Registrasi ke Auth Service (Port 8086)
        RegisterAuthPayload authPayload = RegisterAuthPayload.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(rawRandomPassword)
                .role("TEACHER") // <--- Set khusus Role Guru
                .build();

        Long generatedUserId;
        try {
            AuthGenericResponse authResponse = restTemplate.postForObject(AUTH_SERVICE_URL, authPayload,
                    AuthGenericResponse.class);
            if (authResponse != null && authResponse.getData() != null) {
                generatedUserId = authResponse.getData().getId();
            } else {
                throw new RuntimeException("Gagal mengambil ID baru dari Auth Service");
            }
        } catch (Exception e) {
            throw new RuntimeException("Gagal mendaftarkan akun Guru ke Auth Service: " + e.getMessage());
        }

        // 4. Transformasi dan Save ke DB Teacher menggunakan Shared ID
        Teacher teacher = requestTeacherToTeacher(request);
        teacher.setId(generatedUserId); // Menyetel ID agar sama persis dengan Auth DB
        teacher.setStatus("ACTIVE");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());

        Teacher savedTeacher = teacherRepository.save(teacher);

        // 5. Kirim Email Kredensial Teks Asli ke Guru
        try {
            emailService.sendCredentialsEmail(request.getEmail(), request.getFullName(), rawRandomPassword);
        } catch (Exception e) {
            System.err.println("Peringatan: Gagal mengirimkan email kredensial guru. Error: " + e.getMessage());
        }

        return teacherToResponseTeacherDto(savedTeacher);
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        SecureRandom random = new SecureRandom();
        return random.ints(10, 0, chars.length())
                .mapToObj(chars::charAt)
                .map(Object::toString)
                .collect(Collectors.joining());
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
        List<TeacherResponse> teacherResponseList = teachers.getContent().stream()
                .map(this::teacherToResponseTeacherDto).toList();

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
            if (teacherRepository.existsByNip(request.getNip())) {
                throw new Exception("NIP already exists");
            }
        }

        if (!teacher.getEmail().equals(request.getEmail())) {
            if (teacherRepository.existsByEmail(request.getEmail())) {
                throw new Exception("Email sudah digunakan oleh guru lain");
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

    @Override
    public TeacherResponse getTeacherByEmail(String email) throws Exception {
        Teacher teacher = teacherRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Guru dengan email tersebut tidak ditemukan"));
        return teacherToResponseTeacherDto(teacher);
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