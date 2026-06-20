package com.example.subject_service.models;

import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "class_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "teacher_id", nullable = false) 
    private Long teacherId;

    private String dayOfWeek; // Contoh: "MONDAY"
    private LocalTime startTime; // Contoh: 08:00:00

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "schedule_students", joinColumns = @JoinColumn(name = "schedule_id"))
    @Column(name = "student_id")
    private List<Long> studentIds;
}