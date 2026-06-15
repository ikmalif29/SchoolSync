package com.example.payment_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.payment_service.services.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @GetMapping("/send-email")
    public ResponseEntity<?> sendEmail() {

        try {

            emailService.sendEmail(
                    "tujuan@gmail.com",
                    "Test Email",
                    "Halo, email berhasil dikirim dari Payment Service.");

            return ResponseEntity.ok("Email berhasil dikirim");

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}