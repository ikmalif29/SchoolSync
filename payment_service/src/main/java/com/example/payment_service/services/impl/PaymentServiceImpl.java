package com.example.payment_service.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.payment_service.dtos.req.CreatePaymentRequest;
import com.example.payment_service.dtos.res.PaymentResponse;
import com.example.payment_service.enums.PaymentStatus;
import com.example.payment_service.enums.PaymentType;
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
        
        // 1. Validasi awal field mandatori
        if (request.getStudentId() == null ||
                request.getAmount() == null ||
                request.getPaymentType() == null ||
                request.getDueDate() == null) {
            throw new Exception("Semua field wajib diisi");
        }

        // Ambil semua riwayat pembayaran siswa terlebih dahulu
        List<Payment> existingPayments = paymentRepository.findByStudentId(request.getStudentId());

        // 2. --- PERBAIKAN VALIDASI CEK TAGIHAN DUPLIKAT ---
        if (request.getPaymentType() == PaymentType.SPP_BULANAN) {
            // Validasi khusus SPP Bulanan: Cek kesamaan Type, Academic Year, dan Period Month
            boolean isAlreadyExist = existingPayments.stream().anyMatch(p -> 
                p.getPaymentType() == PaymentType.SPP_BULANAN &&
                request.getAcademicYear().equals(p.getAcademicYear()) &&
                request.getPeriodMonth() != null && request.getPeriodMonth().equals(p.getPeriodMonth()) &&
                (p.getPaymentStatus() == PaymentStatus.PAID || p.getPaymentStatus() == PaymentStatus.PENDING)
            );

            if (isAlreadyExist) {
                throw new Exception("Gagal membuat tagihan: Siswa ini sudah memiliki tagihan SPP aktif atau sudah lunas untuk periode bulan tersebut.");
            }
        } else {
            // PERBAIKAN UTAMA: Validasi tagihan non-SPP (Seragam, Biaya Ujian, dll)
            // Memastikan p.getPaymentType() COCOK dengan request.getPaymentType() agar tidak saling bertabrakan
            boolean isAlreadyExist = existingPayments.stream().anyMatch(p -> 
                p.getPaymentType() == request.getPaymentType() &&
                request.getAcademicYear().equals(p.getAcademicYear()) &&
                (p.getPaymentStatus() == PaymentStatus.PAID || p.getPaymentStatus() == PaymentStatus.PENDING)
            );

            if (isAlreadyExist) {
                throw new Exception("Gagal membuat tagihan: Tagihan jenis " + request.getPaymentType() + " sudah ada atau sudah dibayar untuk tahun ajaran ini.");
            }
        }
        // ---------------------------------------------------

        Payment payment = requestPaymentToPayment(request);

        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());

        Payment savedPayment = paymentRepository.save(payment);

        if (request.getStudentEmail() != null && !request.getStudentEmail().isBlank()) {
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
                .targetClassLevel(payment.getTargetClassLevel())
                .academicYear(payment.getAcademicYear())
                .periodMonth(payment.getPeriodMonth())
                .build();
    }

    private Payment requestPaymentToPayment(CreatePaymentRequest request) {
        return Payment.builder()
                .studentId(request.getStudentId())
                .amount(request.getAmount())
                .description(request.getDescription())
                .paymentType(request.getPaymentType())
                .dueDate(request.getDueDate())
                .targetClassLevel(request.getTargetClassLevel())
                .academicYear(request.getAcademicYear())
                .periodMonth(request.getPaymentType() == PaymentType.SPP_BULANAN ? request.getPeriodMonth() : null)
                .build();
    }
}