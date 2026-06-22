package com.example.grade_service.services.impl;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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

        if (student == null)
            throw new Exception("Student tidak ditemukan");
        if (teacher == null)
            throw new Exception("Teacher tidak ditemukan");
        if (subject == null)
            throw new Exception("Subject tidak ditemukan");

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

    private Double calculateFinalScore(Double assignmentScore, Double midExamScore, Double finalExamScore) {
        return (assignmentScore * 0.30) + (midExamScore * 0.30) + (finalExamScore * 0.40);
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
    public List<GradeResponse> getGradeByTeacherId(Long teacherId) throws Exception {
        // Mencari list data nilai berdasarkan ID Guru ke repository
        List<Grade> grades = gradeRepository.findByTeacherId(teacherId);

        // Mapping dari entity Grade ke GradeResponse DTO
        return grades.stream()
                .map(this::gradeToResponseGradeDto)
                .collect(Collectors.toList());
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
        if (finalScore >= 90)
            return "A";
        if (finalScore >= 80)
            return "B";
        if (finalScore >= 70)
            return "C";
        if (finalScore >= 60)
            return "D";
        return "E";
    }

    @Override
    public byte[] generateGradeExcel(String email) throws Exception {
        // 1. Ambil data siswa via Client
        StudentResponse student = studentClient.getStudentByEmail(email);
        if (student == null) {
            throw new RuntimeException("Siswa tidak ditemukan");
        }

        // 2. Ambil data nilai dari repositori lokal
        List<Grade> allGrades = gradeRepository.findByStudentId(student.getId());
        List<GradeResponse> grades = allGrades.stream().map(this::gradeToResponseGradeDto).toList();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Rapor Siswa");

            // --- STYLING BASICS ---
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle centerStyle = workbook.createCellStyle();
            centerStyle.setAlignment(HorizontalAlignment.CENTER);

            CellStyle boldStyle = workbook.createCellStyle();
            Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldStyle.setFont(boldFont);

            // --- DATA IDENTITAS SISWA ---
            Row rowTitle = sheet.createRow(0);
            Cell titleCell = rowTitle.createCell(0);
            titleCell.setCellValue("RAPOR HASIL BELAJAR SISWA");
            titleCell.setCellStyle(boldStyle);

            Row rowNama = sheet.createRow(2);
            rowNama.createCell(0).setCellValue("Nama Siswa:");
            rowNama.createCell(1).setCellValue(student.getFullName() != null ? student.getFullName() : "-");
            rowNama.createCell(3).setCellValue("Kelas:");
            rowNama.createCell(4).setCellValue(student.getClassName() != null ? student.getClassName() : "-");

            Row rowNis = sheet.createRow(3);
            rowNis.createCell(0).setCellValue("NIS/NIM:");
            rowNis.createCell(1).setCellValue(student.getNis() != null ? student.getNis() : "-");
            rowNis.createCell(3).setCellValue("Jurusan:");
            rowNis.createCell(4).setCellValue(student.getMajor() != null ? student.getMajor() : "-");

            // --- TABLE HEADERS ---
            Row headerRow = sheet.createRow(5);
            String[] columns = { "Mata Pelajaran", "Nilai Tugas", "UTS", "UAS", "Nilai Akhir", "Huruf" };
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // --- DYNAMIC DATA ---
            int currentRowIndex = 6;
            double totalFinalScore = 0;

            if (!grades.isEmpty()) {
                for (GradeResponse grade : grades) {
                    Row dataRow = sheet.createRow(currentRowIndex++);

                    dataRow.createCell(0).setCellValue(grade.getSubjectName() != null ? grade.getSubjectName() : "N/A");

                    Cell cAssignment = dataRow.createCell(1);
                    cAssignment.setCellValue(grade.getAssignmentScore() != null ? grade.getAssignmentScore() : 0.0);
                    cAssignment.setCellStyle(centerStyle);

                    Cell cMid = dataRow.createCell(2);
                    cMid.setCellValue(grade.getMidExamScore() != null ? grade.getMidExamScore() : 0.0);
                    cMid.setCellStyle(centerStyle);

                    Cell cFinal = dataRow.createCell(3);
                    cFinal.setCellValue(grade.getFinalExamScore() != null ? grade.getFinalExamScore() : 0.0);
                    cFinal.setCellStyle(centerStyle);

                    Cell cTotal = dataRow.createCell(4);
                    cTotal.setCellValue(grade.getFinalScore() != null ? grade.getFinalScore() : 0.0);
                    cTotal.setCellStyle(centerStyle);

                    Cell cLetter = dataRow.createCell(5);
                    cLetter.setCellValue(grade.getGradeLetter() != null ? grade.getGradeLetter() : "-");
                    cLetter.setCellStyle(centerStyle);

                    if (grade.getFinalScore() != null) {
                        totalFinalScore += grade.getFinalScore();
                    }
                }
            } else {
                Row emptyRow = sheet.createRow(currentRowIndex++);
                Cell emptyCell = emptyRow.createCell(0);
                emptyCell.setCellValue("Belum ada data komponen nilai untuk siswa ini.");
                sheet.addMergedRegion(
                        new org.apache.poi.ss.util.CellRangeAddress(currentRowIndex - 1, currentRowIndex - 1, 0, 5));
            }

            // --- SUMMARY ROW (RATA-RATA) ---
            Row summaryRow = sheet.createRow(currentRowIndex);
            Cell labelAvg = summaryRow.createCell(0);
            labelAvg.setCellValue("Rata-Rata Nilai Akhir");
            labelAvg.setCellStyle(boldStyle);

            Cell avgCell = summaryRow.createCell(4);
            if (!grades.isEmpty()) {
                avgCell.setCellValue(totalFinalScore / grades.size());
            } else {
                avgCell.setCellValue(0.0);
            }
            avgCell.setCellStyle(centerStyle);

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    // METHOD REFACTOR: Menggunakan proteksi try-catch terisolasi pada network call
    // HTTP client
    private GradeResponse gradeToResponseGradeDto(Grade grade) {
        StudentResponse student = null;
        try {
            student = studentClient.getStudent(grade.getStudentId());
        } catch (Exception e) {
            System.err.println("Gagal memuat Student-Service: " + e.getMessage());
        }

        TeacherResponse teacher = null;
        try {
            teacher = teacherClient.getTeacher(grade.getTeacherId());
        } catch (Exception e) {
            System.err.println("Gagal memuat Teacher-Service: " + e.getMessage());
        }

        SubjectResponse subject = null;
        try {
            subject = subjectClient.getSubject(grade.getSubjectId());
        } catch (Exception e) {
            System.err.println("Gagal memuat Subject-Service: " + e.getMessage());
        }

        return GradeResponse.builder()
                .id(grade.getId())
                .studentId(grade.getStudentId())
                .studentName(student != null ? student.getFullName() : "N/A (Service Down)")
                .teacherId(grade.getTeacherId())
                .teacherName(teacher != null ? teacher.getFullName() : "N/A (Service Down)")
                .subjectId(grade.getSubjectId())
                .subjectName(subject != null ? subject.getSubjectName() : "N/A (Service Down)")
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