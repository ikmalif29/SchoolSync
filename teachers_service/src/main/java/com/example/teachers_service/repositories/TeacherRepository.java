package com.example.teachers_service.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.teachers_service.models.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    boolean existsByNip(String nip);

    Optional<Teacher> findByNip(String nip);
}