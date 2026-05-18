package com.example.store.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.store.auth.JwtAuthenticationFilter;
import com.example.store.user.UserRepository;

@Configuration
public class SecurityConfig {

    private final JwtService jwtService;
    private final UserRepository userRepo;

    public SecurityConfig(JwtService jwtService, UserRepository userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService, userRepo);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpStatus.UNAUTHORIZED.value());
                })
            )

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()

                .requestMatchers("/api/products/**").permitAll()

                .requestMatchers("/api/orders/**").hasRole("USER")

                // .anyRequest().authenticated()
            )

            .httpBasic(h -> h.disable())

            .addFilterBefore(
                jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}