package com.example.store.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.store.auth.JwtAuthenticationFilter;
import com.example.store.user.UserRepository;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtAuthenticationFilter jwtFilter(JwtService jwtService, UserRepository userRepo) {
        return new JwtAuthenticationFilter(jwtService, userRepo);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtFilter = jwtFilter(null, null); // will be injected by Spring

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(h -> h.disable());

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    
}