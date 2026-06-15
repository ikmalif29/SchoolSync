package com.example.payment_service.services;

import java.util.List;

import com.example.payment_service.dtos.req.CreatePaymentRequest;
import com.example.payment_service.dtos.res.PaymentResponse;

public interface PaymentService {

    PaymentResponse createPayment(CreatePaymentRequest request) throws Exception;

    PaymentResponse payPayment(Long id) throws Exception;

    List<PaymentResponse> getAllPayments() throws Exception;

    PaymentResponse getPaymentById(Long id) throws Exception;

    List<PaymentResponse> getPaymentByStudentId(Long studentId) throws Exception;

    PaymentResponse cancelPayment(Long id) throws Exception;
}