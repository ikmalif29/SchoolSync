package com.example.grade_service.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.grade_service.clients.StudentClient;
import com.example.grade_service.clients.SubjectClient;
import com.example.grade_service.clients.TeacherClient;
import com.example.grade_service.dtos.req.CreateGradeRequest;
import com.example.grade_service.dtos.res.GradeResponse;
import com.example.grade_service.dtos.res.PaginationResponse;
import com.example.grade_service.dtos.res.students.StudentResponse;
import com.example.grade_service.dtos.res.subject.SubjectResponse;
import com.example.grade_service.dtos.res.teacher.TeacherResponse;
import com.example.grade_service.models.Grade;
import com.example.grade_service.repositories.GradeRepository;
import com.example.grade_service.services.GradeService;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class GradeServiceImpl implements GradeService {
    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private StudentClient studentClient;

    @Autowired
    private TeacherClient teacherClient;

    @Autowired
    private SubjectClient subjectClient;

    @Override
    public GradeResponse createGrade(CreateGradeRequest request) throws Exception {

        if (request.getStudentId() == null ||
                request.getTeacherId() == null ||
                request.getSubjectId() == null ||
                request.getAssignmentScore() == null ||
                request.getMidExamScore() == null ||
                request.getFinalExamScore() == null) {

            throw new Exception("Semua field wajib diisi");
        }

        boolean gradeExists = gradeRepository.existsByStudentIdAndSubjectId(
                request.getStudentId(),
                request.getSubjectId());

        if (gradeExists) {
            throw new Exception("Nilai siswa untuk mata pelajaran ini sudah ada");
        }

        StudentResponse student = studentClient.getStudent(request.getStudentId());

        TeacherResponse teacher = teacherClient.getTeacher(request.getTeacherId());

        SubjectResponse subject = subjectClient.getSubject(request.getSubjectId());

        if (student == null) {
            throw new Exception("Student tidak ditemukan");
        }

        if (teacher == null) {
            throw new Exception("Teacher tidak ditemukan");
        }

        if (subject == null) {
            throw new Exception("Subject tidak ditemukan");
        }

        Grade grade = requestGradeToGrade(request);

        Double finalScore = calculateFinalScore(
                request.getAssignmentScore(),
                request.getMidExamScore(),
                request.getFinalExamScore());

        grade.setFinalScore(finalScore);
        grade.setGradeLetter(calculateGradeLetter(finalScore));

        Grade savedGrade = gradeRepository.save(grade);

        return gradeToResponseGradeDto(savedGrade);
    }

    private Double calculateFinalScore(
            Double assignmentScore,
            Double midExamScore,
            Double finalExamScore) {

        return (assignmentScore * 0.30)
                + (midExamScore * 0.30)
                + (finalExamScore * 0.40);
    }

    @Override
    public PaginationResponse<GradeResponse> getAllGrades(Integer page, Integer size) throws Exception {
        Pageable pageable = PageRequest.of(page, size);
        Page<Grade> allGrades = gradeRepository.findAll(pageable);

        List<GradeResponse> grades = allGrades.getContent().stream().map(this::gradeToResponseGradeDto).toList();
        
        return PaginationResponse.<GradeResponse>builder()
                .content(grades)
                .page(allGrades.getNumber())
                .size(allGrades.getSize())
                .totalElements(allGrades.getTotalElements())
                .totalPages(allGrades.getTotalPages())
                .last(allGrades.isLast())
                .build();
    }

    @Override
    public GradeResponse getGradeById(Long id) throws Exception {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new Exception("Data tidak ditemukan"));

        return gradeToResponseGradeDto(grade);
    }

    @Override
    public List<GradeResponse> getGradeByStudentId(Long studentId) throws Exception {
        List<Grade> allGrades = gradeRepository.findByStudentId(studentId);

        if (allGrades.isEmpty()) {
            throw new Exception("Data tidak ditemukan");
        }

        return allGrades.stream().map(this::gradeToResponseGradeDto).toList();
    }

    @Override
    public GradeResponse updateGrade(Long id, CreateGradeRequest request) throws Exception {

        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new Exception("Data tidak ditemukan"));

        if (request.getStudentId() == null ||
                request.getTeacherId() == null ||
                request.getSubjectId() == null ||
                request.getAssignmentScore() == null ||
                request.getMidExamScore() == null ||
                request.getFinalExamScore() == null) {

            throw new Exception("Semua field wajib diisi");
        }

        boolean gradeExists = gradeRepository.existsByStudentIdAndSubjectIdAndIdNot(
                request.getStudentId(),
                request.getSubjectId(),
                id);

        if (gradeExists) {
            throw new Exception("Nilai siswa untuk mata pelajaran ini sudah ada");
        }

        grade.setStudentId(request.getStudentId());
        grade.setTeacherId(request.getTeacherId());
        grade.setSubjectId(request.getSubjectId());
        grade.setAssignmentScore(request.getAssignmentScore());
        grade.setMidExamScore(request.getMidExamScore());
        grade.setFinalExamScore(request.getFinalExamScore());

        Double finalScore = calculateFinalScore(
                request.getAssignmentScore(),
                request.getMidExamScore(),
                request.getFinalExamScore());

        grade.setFinalScore(finalScore);
        grade.setGradeLetter(calculateGradeLetter(finalScore));

        Grade savedGrade = gradeRepository.save(grade);

        return gradeToResponseGradeDto(savedGrade);
    }

    @Override
    public void deleteGrade(Long id) throws Exception {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new Exception("Data tidak ditemukan"));

        gradeRepository.delete(grade);
    }

    private String calculateGradeLetter(Double finalScore) {
        if (finalScore >= 90) {
            return "A";
        }

        if (finalScore >= 80) {
            return "B";
        }

        if (finalScore >= 70) {
            return "C";
        }

        if (finalScore >= 60) {
            return "D";
        }

        return "E";
    }

    private GradeResponse gradeToResponseGradeDto(Grade grade) {

        StudentResponse student =
                studentClient.getStudent(grade.getStudentId());
    
        TeacherResponse teacher =
                teacherClient.getTeacher(grade.getTeacherId());
    
        SubjectResponse subject =
                subjectClient.getSubject(grade.getSubjectId());
    
        return GradeResponse.builder()
                .id(grade.getId())
    
                .studentId(grade.getStudentId())
                .studentName(
                        student != null
                                ? student.getFullName()
                                : null)
    
                .teacherId(grade.getTeacherId())
                .teacherName(
                        teacher != null
                                ? teacher.getFullName()
                                : null)
    
                .subjectId(grade.getSubjectId())
                .subjectName(
                        subject != null
                                ? subject.getSubjectName()
                                : null)
    
                .className(grade.getClassName())
    
                .assignmentScore(grade.getAssignmentScore())
                .midExamScore(grade.getMidExamScore())
                .finalExamScore(grade.getFinalExamScore())
    
                .finalScore(grade.getFinalScore())
                .gradeLetter(grade.getGradeLetter())
    
                .build();
    }

    private Grade requestGradeToGrade(CreateGradeRequest request) {
        return Grade.builder()
                .studentId(request.getStudentId())
                .teacherId(request.getTeacherId())
                .subjectId(request.getSubjectId())
                .className(request.getClassName())
                .assignmentScore(request.getAssignmentScore())
                .midExamScore(request.getMidExamScore())
                .finalExamScore(request.getFinalExamScore())
                .build();
    }

}
