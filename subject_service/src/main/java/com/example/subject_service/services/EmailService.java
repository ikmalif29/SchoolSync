package com.example.subject_service.services;

import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendReminderEmail(String to, String studentName, String subjectName, LocalTime time) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("⏰ Pengingat Kelas: " + subjectName);
        message.setText("Halo " + studentName + ",\n\nKelas " + subjectName + " akan dimulai dalam 15 menit (Jam " + time + "). Siap-siap ya!");
        mailSender.send(message);
    }
}