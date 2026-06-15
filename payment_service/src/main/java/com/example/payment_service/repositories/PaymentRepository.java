package com.example.payment_service.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.payment_service.enums.PaymentStatus;
import com.example.payment_service.models.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByStudentId(Long studentId);

    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);

}