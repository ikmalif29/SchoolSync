package com.example.auth_service.seeder;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.auth_service.enums.Role;
import com.example.auth_service.models.User;
import com.example.auth_service.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (!userRepository.existsByUsername("admin")) {

            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@gmail.com")
                    .role(Role.ADMIN)
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            userRepository.save(admin);

            System.out.println("=================================");
            System.out.println("DEFAULT ADMIN CREATED");
            System.out.println("username : admin");
            System.out.println("password : admin123");
            System.out.println("=================================");
        }
    }
}