package com.example.payment_service.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.payment_service.dtos.req.CreatePaymentRequest;
import com.example.payment_service.dtos.res.PaymentResponse;
import com.example.payment_service.enums.PaymentStatus;
import com.example.payment_service.models.Payment;
import com.example.payment_service.repositories.PaymentRepository;
import com.example.payment_service.services.EmailService;
import com.example.payment_service.services.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public PaymentResponse createPayment(CreatePaymentRequest request) throws Exception {
        System.out.println("studentId = " + request.getStudentId());
        System.out.println("studentEmail = " + request.getStudentEmail());
        System.out.println("amount = " + request.getAmount());
        System.out.println("description = " + request.getDescription());
        System.out.println("paymentType = " + request.getPaymentType());
        System.out.println("dueDate = " + request.getDueDate());

        if (request.getStudentId() == null ||
                request.getAmount() == null ||
                request.getPaymentType() == null ||
                request.getDueDate() == null) {

            throw new Exception("Semua field wajib diisi");
        }

        Payment payment = requestPaymentToPayment(request);

        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        if (request.getStudentEmail() != null &&
                !request.getStudentEmail().isBlank()) {

            emailService.sendEmail(
                    request.getStudentEmail(),
                    "Tagihan Pembayaran Baru",
                    """
                            Halo,

                            Anda memiliki tagihan baru.

                            Nominal : Rp %.0f
                            Deskripsi : %s
                            Jatuh Tempo : %s

                            Silakan segera melakukan pembayaran.
                            """
                            .formatted(
                                    savedPayment.getAmount(),
                                    savedPayment.getDescription(),
                                    savedPayment.getDueDate()));
        }

        return paymentToPaymentResponseDto(savedPayment);
    }

    @Override
    public PaymentResponse payPayment(Long id) throws Exception {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new Exception("Payment tidak ditemukan"));

        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            throw new Exception("Tagihan sudah dibayar");
        }

        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        payment.setUpdatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        return paymentToPaymentResponseDto(savedPayment);
    }

    @Override
    public PaymentResponse cancelPayment(Long id) throws Exception {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new Exception("Payment tidak ditemukan"));

        if (payment.getPaymentStatus() == PaymentStatus.PAID) {
            throw new Exception("Pembayaran yang sudah lunas tidak bisa dibatalkan");
        }

        payment.setPaymentStatus(PaymentStatus.CANCELLED);
        payment.setUpdatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        return paymentToPaymentResponseDto(savedPayment);
    }

    @Override
    public List<PaymentResponse> getAllPayments() throws Exception {

        List<Payment> payments = paymentRepository.findAll();

        if (payments.isEmpty()) {
            throw new Exception("Data pembayaran kosong");
        }

        return payments.stream()
                .map(this::paymentToPaymentResponseDto)
                .toList();
    }

    @Override
    public PaymentResponse getPaymentById(Long id) throws Exception {

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new Exception("Payment tidak ditemukan"));

        return paymentToPaymentResponseDto(payment);
    }

    @Override
    public List<PaymentResponse> getPaymentByStudentId(Long studentId) throws Exception {

        List<Payment> payments = paymentRepository.findByStudentId(studentId);

        if (payments.isEmpty()) {
            throw new Exception("Data pembayaran kosong");
        }

        return payments.stream()
                .map(this::paymentToPaymentResponseDto)
                .toList();
    }

    private PaymentResponse paymentToPaymentResponseDto(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .studentId(payment.getStudentId())
                .amount(payment.getAmount())
                .description(payment.getDescription())
                .paymentType(payment.getPaymentType())
                .paymentStatus(payment.getPaymentStatus())
                .dueDate(payment.getDueDate())
                .paymentDate(payment.getPaymentDate())
                .build();
    }

    private Payment requestPaymentToPayment(CreatePaymentRequest request) {
        return Payment.builder()
                .studentId(request.getStudentId())
                .amount(request.getAmount())
                .description(request.getDescription())
                .paymentType(request.getPaymentType())
                .dueDate(request.getDueDate())
                .build();
    }
}
