package com.example.teachers_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI studentsServiceOpenAPI() {

        return new OpenAPI()

                .info(
                        new Info()
                                .title("Students Service API")
                                .description("REST API Documentation for Academic System Students Service")
                                .version("v1.0.0")
                                .contact(
                                        new Contact()
                                                .name("Ikmal Fauzaeni")
                                                .email("ikmal@example.com")
                                )
                                .license(
                                        new License()
                                                .name("Apache 2.0")
                                                .url("https://springdoc.org")
                                )
                )

                .externalDocs(
                        new ExternalDocumentation()
                                .description("Academic System Repository")
                                .url("https://github.com/your-repository")
                );
    }
}