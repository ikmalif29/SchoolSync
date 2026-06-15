package com.example.grade_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .requestInterceptor((request, body, execution) -> {
                    // 1. Ambil request HTTP yang masuk dari React ke Grade-Service
                    ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                    
                    if (attributes != null) {
                        HttpServletRequest currentRequest = attributes.getRequest();
                        String authHeader = currentRequest.getHeader(HttpHeaders.AUTHORIZATION);
                        
                        // 2. Jika token JWT ada, pasang otomatis ke request internal RestClient
                        if (authHeader != null && !authHeader.isEmpty()) {
                            request.getHeaders().add(HttpHeaders.AUTHORIZATION, authHeader);
                        }
                    }
                    
                    return execution.execute(request, body);
                })
                .build();
    }
}