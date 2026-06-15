package com.example.students_service.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.students_service.dtos.req.CreateStudentRequest;
import com.example.students_service.dtos.res.PaginationResponse;
import com.example.students_service.dtos.res.StudentResponse;
import com.example.students_service.models.Student;
import com.example.students_service.repositories.StudentRepository;
import com.example.students_service.services.StudentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    @Autowired
    private final StudentRepository studentRepository;

    @Override
    public StudentResponse createStudent(CreateStudentRequest request) throws Exception {

        if (request.getNis() == null || request.getNis().isBlank() ||
                request.getFullName() == null || request.getFullName().isBlank() ||
                request.getClassName() == null || request.getClassName().isBlank() ||
                request.getMajor() == null || request.getMajor().isBlank()) {
            throw new RuntimeException("Semua field wajib diisi");
        }

        boolean isExist = studentRepository.existsByNis(request.getNis());

        if (isExist) {
            throw new RuntimeException("NIS sudah terdaftar");
        }

        Student student = requestStudentToStudent(request);

        student.setStatus("ACTIVE");

        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());

        Student savedStudent = studentRepository.save(student);

        return studentsToResponseStudentDto(savedStudent);
    }

    @Override
    public StudentResponse getStudentById(Long id) throws Exception {
        Student student = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));

        return studentsToResponseStudentDto(student);
    }

    @Override
    public StudentResponse uploadPhoto(Long id, MultipartFile photo) throws Exception {
        Student student = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));

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
        Student student = studentRepository.findByNis(nis).orElseThrow(() -> new RuntimeException("Student not found"));

        return studentsToResponseStudentDto(student);
    }

    @Override
    public PaginationResponse<StudentResponse> getAllStudent(
            Integer page,
            Integer size) throws Exception {

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
        Student student = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));

        studentRepository.delete(student);
    }

    @Override
    public StudentResponse updateStudent(Long id, CreateStudentRequest request) throws Exception {
        Student student = studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));

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

    private StudentResponse studentsToResponseStudentDto(Student student) {
        if (student.getPhoto() != null) {
        }

        return StudentResponse.builder()
                .id(student.getId())
                .nis(student.getNis())
                .fullName(student.getFullName())
                .gender(student.getGender())
                .className(student.getClassName())
                .major(student.getMajor())
                .status(student.getStatus())
                // .photoBase64(photoBase64)
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