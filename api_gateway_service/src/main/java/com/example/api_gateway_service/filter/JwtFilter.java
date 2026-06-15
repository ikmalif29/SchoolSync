package com.example.api_gateway_service.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import lombok.RequiredArgsConstructor;

import com.example.api_gateway_service.security.JwtUtil;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtFilter implements GlobalFilter {

        private final JwtUtil jwtUtil;

        @Override
        public Mono<Void> filter(
                        ServerWebExchange exchange,
                        GatewayFilterChain chain) {

                String path = exchange.getRequest()
                                .getURI()
                                .getPath();

                if (path.startsWith("/auth/login")
                                || path.startsWith("/auth/register")) {

                        return chain.filter(exchange);
                }

                String authHeader = exchange.getRequest()
                                .getHeaders()
                                .getFirst("Authorization");

                if (authHeader == null
                                || !authHeader.startsWith("Bearer ")) {

                        exchange.getResponse()
                                        .setStatusCode(HttpStatus.UNAUTHORIZED);

                        return exchange.getResponse()
                                        .setComplete();
                }

                try {

                        String token = authHeader.substring(7);

                        Claims claims = jwtUtil.validateToken(token);

                        exchange.getRequest()
                                        .mutate()
                                        .header(
                                                        "X-User",
                                                        claims.getSubject())
                                        .header(
                                                        "X-Role",
                                                        claims.get("role").toString())
                                        .build();

                } catch (Exception e) {

                        exchange.getResponse()
                                        .setStatusCode(HttpStatus.UNAUTHORIZED);

                        return exchange.getResponse()
                                        .setComplete();
                }

                return chain.filter(exchange);
        }
}