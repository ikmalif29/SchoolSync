package com.example.grade_service.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class GradeResponse {

    private Long id;

    private Long studentId;
    private String studentName;

    private Long teacherId;
    private String teacherName;

    private Long subjectId;
    private String subjectName;

    private String className;

    private Double assignmentScore;
    private Double midExamScore;
    private Double finalExamScore;

    private Double finalScore;

    private String gradeLetter;
}