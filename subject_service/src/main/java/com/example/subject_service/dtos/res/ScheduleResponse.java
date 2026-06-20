package com.example.subject_service.dtos.res;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ScheduleResponse {
    private Long id;
    private Long subjectId;
    private String subjectName; // Langsung tampilkan nama mapelnya agar frontend tidak perlu nyari lagi
    private String dayOfWeek;
    private Long teacherId;
    private String teacherName;
    private LocalTime startTime;
    private List<Long> studentIds;
}