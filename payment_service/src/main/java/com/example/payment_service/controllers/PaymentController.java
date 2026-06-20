package com.example.payment_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.payment_service.dtos.GenericResponse;
import com.example.payment_service.dtos.req.CreatePaymentRequest;
import com.example.payment_service.services.PaymentService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(@RequestBody CreatePaymentRequest request) {
        System.out.println(request);
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(paymentService.createPayment(request), "Succesfully create payment"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/pay-payment")
    public ResponseEntity<?> payPayment(@RequestParam Long id) { // Tambah @RequestParam
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(paymentService.payPayment(id), "Succesfully pay payment"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel-payment")
    public ResponseEntity<?> cancelPayment(@RequestParam Long id) { // Tambah @RequestParam
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(paymentService.cancelPayment(id), "Succesfully cancel payment"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-all-payments")
    public ResponseEntity<?> getAllPayment() {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(paymentService.getAllPayments(), "Succesfully get all payments"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-payment-by-student-id/{studentId}")
    public ResponseEntity<?> getPaymentByStudentId(@PathVariable Long studentId) {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(paymentService.getPaymentByStudentId(studentId), "Succesfully get payment by student id"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get-payment-by-id/{id}")
    public ResponseEntity<?> getPaymentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok()
                    .body(GenericResponse.succes(paymentService.getPaymentById(id), "Succesfully get payment by id"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}