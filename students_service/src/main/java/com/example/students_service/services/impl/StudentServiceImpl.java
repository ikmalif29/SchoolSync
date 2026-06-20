package com.example.students_service.services.impl;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.security.SecureRandom;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;

import com.example.students_service.dtos.req.CreateStudentRequest;
import com.example.students_service.dtos.req.RegisterAuthPayload; // Import DTO baru
import com.example.students_service.dtos.res.PaginationResponse;
import com.example.students_service.dtos.res.StudentDetailResponse;
import com.example.students_service.dtos.res.StudentResponse;
import com.example.students_service.dtos.res.AuthGenericResponse; // Import DTO baru
import com.example.students_service.models.Student;
import com.example.students_service.repositories.StudentRepository;
import com.example.students_service.services.StudentService;
import com.example.students_service.services.EmailService; // Import EmailService pendukung

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final EmailService emailService; // Inject EmailService otomatis via Lombok
    private final RestTemplate restTemplate = new RestTemplate(); // Diinisialisasi langsung

    // Sesuaikan URL ini dengan port gateway atau port Auth Service aslimu
    // Ubah port menjadi 8086 sesuai dengan port running Auth Service kamu
    private final String AUTH_SERVICE_URL = "http://localhost:8086/auth/register";

    @Override
    public StudentResponse createStudent(CreateStudentRequest request) throws Exception {
        // 1. Validasi Field Wajib
        if (request.getNis() == null || request.getNis().isBlank() ||
                request.getFullName() == null || request.getFullName().isBlank() ||
                request.getClassName() == null || request.getClassName().isBlank() ||
                request.getMajor() == null || request.getMajor().isBlank() ||
                request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Semua field termasuk Email wajib diisi");
        }

        // Validasi Keunikan NIS
        boolean isNisExist = studentRepository.existsByNis(request.getNis());
        if (isNisExist) {
            throw new RuntimeException("NIS sudah terdaftar");
        }

        // --- TAMBAHAN VALIDASI: Validasi Keunikan Email ---
        boolean isEmailExist = studentRepository.existsByEmail(request.getEmail());
        if (isEmailExist) {
            throw new RuntimeException("Email sudah digunakan oleh siswa lain");
        }

        // 2. Generate Password Acak (10 Karakter kombinasi)
        String rawRandomPassword = generateRandomPassword();

        // 3. Siapkan payload dan daftarkan user baru ke Auth Service
        RegisterAuthPayload authPayload = RegisterAuthPayload.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .password(rawRandomPassword)
                .role("STUDENT")
                .build();

        Long generatedUserId;
        try {
            // Menembak endpoint registrasi Auth Service
            AuthGenericResponse authResponse = restTemplate.postForObject(AUTH_SERVICE_URL, authPayload,
                    AuthGenericResponse.class);

            if (authResponse != null && authResponse.getData() != null) {
                generatedUserId = authResponse.getData().getId();
            } else {
                throw new RuntimeException("Gagal mengambil data user baru dari Auth Service");
            }
        } catch (Exception e) {
            // Jika di Auth Service melempar Exception karena Email sudah terdaftar di
            // auth_db, pesan itu akan ditangkap di sini
            throw new RuntimeException("Gagal mendaftarkan akun: " + e.getMessage());
        }

        // 4. Transformasi data dan gunakan Shared ID dari Auth DB
        Student student = requestStudentToStudent(request);
        student.setId(generatedUserId);
        student.setStatus("ACTIVE");
        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());

        Student savedStudent = studentRepository.save(student);

        // 5. Kirim Password Teks Asli ke Email Siswa
        try {
            emailService.sendCredentialsEmail(request.getEmail(), request.getFullName(), rawRandomPassword);
        } catch (Exception e) {
            System.err.println("Peringatan: Gagal mengirimkan email kredensial. Error: " + e.getMessage());
        }

        return studentsToResponseStudentDto(savedStudent);
    }

    // --- Method Helper untuk Membuat Password Acak Secara Aman ---
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
        SecureRandom random = new SecureRandom();
        return random.ints(10, 0, chars.length())
                .mapToObj(chars::charAt)
                .map(Object::toString)
                .collect(Collectors.joining());
    }

    @Override
    public StudentResponse getStudentById(Long id) throws Exception {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return studentsToResponseStudentDto(student);
    }

    @Override
    public StudentDetailResponse getStudentDetailById(Long id) throws Exception {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return studentsToDetailResponseDto(student);
    }

    @Override
    public StudentResponse uploadPhoto(Long id, MultipartFile photo) throws Exception {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (photo == null || photo.isEmpty()) {
            throw new RuntimeException("Photo is required");
        }
        if (!photo.getContentType().startsWith("image/")) {
            throw new RuntimeException("File harus berupa gambar");
        }
        if (photo.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("Ukuran foto maksimal 5 MB");
        }

        student.setPhoto(photo.getBytes());
        student.setUpdatedAt(LocalDateTime.now());

        Student savedStudent = studentRepository.save(student);
        return studentsToResponseStudentDto(savedStudent);
    }

    @Override
    public StudentResponse getStudentByNis(String nis) throws Exception {
        Student student = studentRepository.findByNis(nis)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return studentsToResponseStudentDto(student);
    }

    @Override
    public PaginationResponse<StudentResponse> getAllStudent(Integer page, Integer size) throws Exception {
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> studentPage = studentRepository.findAll(pageable);

        List<StudentResponse> students = studentPage.getContent()
                .stream()
                .map(this::studentsToResponseStudentDto)
                .toList();

        return PaginationResponse.<StudentResponse>builder()
                .content(students)
                .page(studentPage.getNumber())
                .size(studentPage.getSize())
                .totalElements(studentPage.getTotalElements())
                .totalPages(studentPage.getTotalPages())
                .last(studentPage.isLast())
                .build();
    }

    @Override
    public void deleteStudent(Long id) throws Exception {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        studentRepository.delete(student);
    }

    @Override
    public StudentResponse updateStudent(Long id, CreateStudentRequest request) throws Exception {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (request.getNis() == null || request.getNis().isBlank() ||
                request.getFullName() == null || request.getFullName().isBlank() ||
                request.getClassName() == null || request.getClassName().isBlank() ||
                request.getMajor() == null || request.getMajor().isBlank()) {
            throw new RuntimeException("Semua field wajib diisi");
        }

        boolean nisUsedByAnotherStudent = studentRepository.existsByNisAndIdNot(request.getNis(), id);
        if (nisUsedByAnotherStudent) {
            throw new RuntimeException("NIS sudah digunakan siswa lain");
        }

        boolean emailUsedByAnotherStudent = studentRepository.existsByEmailAndIdNot(request.getEmail(), id);
        if (emailUsedByAnotherStudent) {
            throw new RuntimeException("Email sudah digunakan siswa lain");
        }

        student.setNis(request.getNis());
        student.setFullName(request.getFullName());
        student.setGender(request.getGender());
        student.setBirthDate(request.getBirthDate());
        student.setPhoneNumber(request.getPhoneNumber());
        student.setEmail(request.getEmail());
        student.setAddress(request.getAddress());
        student.setClassName(request.getClassName());
        student.setMajor(request.getMajor());
        student.setParentName(request.getParentName());
        student.setParentPhone(request.getParentPhone());
        student.setUpdatedAt(LocalDateTime.now());

        Student updatedStudent = studentRepository.save(student);
        return studentsToResponseStudentDto(updatedStudent);
    }

    @Override
    public StudentDetailResponse getStudentByEmail(String email) throws Exception {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email parameter tidak boleh kosong");
        }

        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Siswa dengan email " + email + " tidak ditemukan"));

        // MENGGUNAKAN MAPPER DETAIL (Sudah termasuk photoBase64 yang kita perbaiki
        // sebelumnya)
        return studentsToDetailResponseDto(student);
    }

    private StudentResponse studentsToResponseStudentDto(Student student) {
        return StudentResponse.builder()
                .id(student.getId())
                .nis(student.getNis())
                .fullName(student.getFullName())
                .gender(student.getGender())
                .className(student.getClassName())
                .major(student.getMajor())
                .status(student.getStatus())
                .build();
    }

    private StudentDetailResponse studentsToDetailResponseDto(Student student) {
        String photoBase64 = null;
        if (student.getPhoto() != null) {
            photoBase64 = Base64.getEncoder().encodeToString(student.getPhoto());
        }

        return StudentDetailResponse.builder()
                .id(student.getId())
                .nis(student.getNis())
                .fullName(student.getFullName())
                .gender(student.getGender())
                .birthDate(student.getBirthDate())
                .phoneNumber(student.getPhoneNumber())
                .email(student.getEmail())
                .address(student.getAddress())
                .className(student.getClassName())
                .major(student.getMajor())
                .parentName(student.getParentName())
                .parentPhone(student.getParentPhone())
                .status(student.getStatus())
                .photoBase64(photoBase64)
                .build();
    }

    private Student requestStudentToStudent(CreateStudentRequest request) {
        return Student.builder()
                .nis(request.getNis())
                .fullName(request.getFullName())
                .gender(request.getGender())
                .birthDate(request.getBirthDate())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .address(request.getAddress())
                .className(request.getClassName())
                .major(request.getMajor())
                .parentName(request.getParentName())
                .parentPhone(request.getParentPhone())
                .build();
    }
}