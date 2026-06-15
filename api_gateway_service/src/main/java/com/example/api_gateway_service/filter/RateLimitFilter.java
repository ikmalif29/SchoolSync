package com.example.api_gateway_service.filter;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class RateLimitFilter implements GlobalFilter {

        @Value("${max_requests:5}") // jika tidak ada di properties, otomatis bernilai 5
        int MAX_REQUEST;

        @Value("${time_window_seconds:30}") // jika tidak ada di properties, otomatis bernilai 30
        long WINDOW_SECONDS;

        private final Map<String, RequestInfo> requests = new ConcurrentHashMap<>();

        @Override
        public Mono<Void> filter(
                        ServerWebExchange exchange,
                        GatewayFilterChain chain) {

                String ip = exchange.getRequest()
                                .getRemoteAddress()
                                .getAddress()
                                .getHostAddress();

                long now = Instant.now().getEpochSecond();

                RequestInfo info = requests.getOrDefault(
                                ip,
                                new RequestInfo(0, now));

                // reset window setelah 30 detik
                if ((now - info.windowStart) >= WINDOW_SECONDS) {
                        info.count = 0;
                        info.windowStart = now;
                }

                info.count++;
                requests.put(ip, info);

                if (info.count > MAX_REQUEST) {
                        exchange.getResponse()
                                        .setStatusCode(HttpStatus.TOO_MANY_REQUESTS);

                        exchange.getResponse()
                                        .getHeaders()
                                        .add("Content-Type", "application/json");

                        String body = """
                                        {
                                            "message":"Rate limit exceeded",
                                            "status":429
                                        }
                                        """;

                        var buffer = exchange.getResponse()
                                        .bufferFactory()
                                        .wrap(body.getBytes());

                        return exchange.getResponse()
                                        .writeWith(Mono.just(buffer));
                }

                return chain.filter(exchange);
        }

        static class RequestInfo {
                int count;
                long windowStart;

                RequestInfo(int count, long windowStart) {
                        this.count = count;
                        this.windowStart = windowStart;
                }
        }
}