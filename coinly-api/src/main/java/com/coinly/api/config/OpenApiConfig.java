package com.coinly.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI coinlyOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Coinly API")
                        .description("API do sistema de moeda estudantil Coinly")
                        .version("0.0.1")
                        .contact(new Contact().name("Coinly"))
                        .license(new License().name("MIT")));
    }
}
