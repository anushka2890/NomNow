package com.nom.api_gateway.config;

import com.nom.api_gateway.filter.JwtAuthFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Autowired
    private JwtAuthFilter jwtAuthFilter;
    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("order-service", r -> r.path("/api/orders/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("http://localhost:8081"))
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("http://localhost:8084"))
                .route("auth-service", r -> r.path("/api/auth/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("http://localhost:8085"))
//                .route("restaurant-service", r -> r.path("/api/rest/**")
//                        .filters(f->f.filter(jwtAuthFilter))
//                        .uri("http://localhost:8082"))
                .build();
    }
}
