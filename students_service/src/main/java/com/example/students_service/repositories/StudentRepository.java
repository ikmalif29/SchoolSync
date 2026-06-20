package com.example.students_service.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.students_service.models.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByNis(String nis);

    boolean existsByEmail(String email);

    Optional<Student> findByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    Optional<Student> findByNis(String nis);

    boolean existsByNisAndIdNot(
            String nis,
            Long id);
}
