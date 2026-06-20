package com.example.subject_service.dtos.req;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateScheduleRequest {
    private Long subjectId;
    private Long teacherId;
    private String dayOfWeek;   // Contoh: "FRIDAY"
    private String startTime;   // Contoh: "08:00:00"
    private List<Long> studentIds; // Kumpulan ID siswa yang mengikuti kelas ini
}