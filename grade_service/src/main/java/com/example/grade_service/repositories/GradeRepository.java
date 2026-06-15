package com.example.grade_service.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.grade_service.models.Grade;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);

    boolean existsByStudentIdAndSubjectId(
            Long studentId,
            Long subjectId);

    boolean existsByStudentIdAndSubjectIdAndIdNot(
            Long studentId,
            Long subjectId,
            Long id);
}