package com.example.teachers_service.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teachers_service.models.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    boolean existsByEmail(String email);
    boolean existsByNip(String nip);
    Optional<Teacher> findByEmail(String email);
    Optional<Teacher> findByNip(String nip);
}