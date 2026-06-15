package com.example.payment_service.dtos.res;

import java.time.LocalDate;

import com.example.payment_service.enums.PaymentStatus;
import com.example.payment_service.enums.PaymentType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;

    private Long studentId;

    private Double amount;

    private String description;

    private PaymentType paymentType;

    private PaymentStatus paymentStatus;

    private LocalDate dueDate;

    private LocalDate paymentDate;
}