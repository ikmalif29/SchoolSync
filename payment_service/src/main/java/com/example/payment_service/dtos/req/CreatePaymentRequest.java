package com.example.payment_service.dtos.req;

import java.time.LocalDate;

import com.example.payment_service.enums.PaymentType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentRequest {
    private Long studentId;
    private String studentEmail;
    private Double amount;
    private String description;
    private PaymentType paymentType;
    private LocalDate dueDate;

    // Field Baru Terintegrasi
    private Integer targetClassLevel;
    private String academicYear;
    private Integer periodMonth;
}