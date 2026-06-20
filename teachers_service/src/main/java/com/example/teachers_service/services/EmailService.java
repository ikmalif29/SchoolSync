package com.example.teachers_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendCredentialsEmail(String toEmail, String fullName, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Informasi Akun Guru Baru");
        message.setText(String.format(
            "Halo Bapak/Ibu %s,\n\n" +
            "Akun Guru Anda telah berhasil didaftarkan oleh Admin ke dalam sistem.\n" +
            "Berikut adalah detail kredensial masuk Anda:\n\n" +
            "Username : (Gunakan Email Anda)\n" +
            "Email    : %s\n" +
            "Password : %s\n\n" +
            "Harap segera melakukan login dan mengubah password sementara Anda demi keamanan akun.\n\n" +
            "Salam,\nAdmin Sekolah",
            fullName, toEmail, password
        ));
        mailSender.send(message);
    }
}