package com.example.subject_service.services;

import com.example.subject_service.dtos.req.CreateScheduleRequest;
import com.example.subject_service.dtos.res.ScheduleResponse;
import com.example.subject_service.dtos.res.PaginationResponse; // 🌟 Import wrapper-mu
import java.util.List;

public interface ClassScheduleService {
    ScheduleResponse createSchedule(CreateScheduleRequest request) throws Exception;
    List<ScheduleResponse> getStudentScheduleToday(Long studentId, String dayOfWeek);
    ScheduleResponse updateSchedule(Long id, CreateScheduleRequest request) throws Exception;
    void deleteSchedule(Long id) throws Exception;
    PaginationResponse<ScheduleResponse> getAllSchedules(String dayOfWeek, Integer page, Integer size) throws Exception;
    List<ScheduleResponse> getScheduleByTeacherId(Long teacherId) throws Exception;
}