package com.example.subject_service.repositories;

import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.subject_service.models.ClassSchedule;

@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {
    List<ClassSchedule> findByDayOfWeekAndStartTimeBetween(String dayOfWeek, LocalTime start, LocalTime end);

    List<ClassSchedule> findByDayOfWeekAndStartTime(String dayOfWeek, LocalTime startTime);
    Page<ClassSchedule> findByDayOfWeek(String dayOfWeek, Pageable pageable);
    List<ClassSchedule> findByStudentIdsContainingAndDayOfWeek(Long studentId, String dayOfWeek);
    List<ClassSchedule> findByTeacherId(Long teacherId);
    boolean existsByTeacherIdAndDayOfWeekAndStartTime(Long teacherId, String dayOfWeek, LocalTime startTime);
    boolean existsByTeacherIdAndDayOfWeekAndStartTimeAndIdNot(Long teacherId, String dayOfWeek, LocalTime startTime, Long id);
}