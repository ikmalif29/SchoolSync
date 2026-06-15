package com.example.auth_service.services.impl;

import java.time.LocalDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.auth_service.dtos.req.LoginRequest;
import com.example.auth_service.dtos.req.RegisterRequest;
import com.example.auth_service.dtos.res.LoginResponse;
import com.example.auth_service.dtos.res.UserResponse;
import com.example.auth_service.models.User;
import com.example.auth_service.repositories.UserRepository;
import com.example.auth_service.security.JwtUtil;
import com.example.auth_service.services.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public UserResponse register(RegisterRequest request) throws Exception {

        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()
                || request.getRole() == null) {

            throw new Exception("Semua field wajib diisi");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new Exception("Username sudah digunakan");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email sudah digunakan");
        }

        User user = requestUserToUser(request);

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        return userToUserResponseDto(savedUser);
    }

    @Override
    public LoginResponse login(LoginRequest request) throws Exception {

        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {

            throw new Exception("Username dan password wajib diisi");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new Exception("Username atau password salah"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new Exception("Username atau password salah");
        }

        String token = jwtUtil.generateToken(user);

        return LoginResponse.builder()
                .username(user.getUsername())
                .role(user.getRole())
                .token(token)
                .build();
    }

    private UserResponse userToUserResponseDto(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .build();
    }

    private User requestUserToUser(RegisterRequest request) {
        return User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .role(request.getRole())
                .build();
    }
}