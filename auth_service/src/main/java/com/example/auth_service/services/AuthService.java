package com.example.auth_service.services;

import com.example.auth_service.dtos.req.LoginRequest;
import com.example.auth_service.dtos.req.RegisterRequest;
import com.example.auth_service.dtos.res.LoginResponse;
import com.example.auth_service.dtos.res.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request) throws Exception;

    LoginResponse login(LoginRequest request) throws Exception;
}