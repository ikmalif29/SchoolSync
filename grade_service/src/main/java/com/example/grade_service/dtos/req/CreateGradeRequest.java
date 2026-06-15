package com.example.grade_service.dtos.req;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGradeRequest {

    private Long studentId;

    private Long teacherId;

    private Long subjectId;

    private String className;

    private Double assignmentScore;

    private Double midExamScore;

    private Double finalExamScore;
}