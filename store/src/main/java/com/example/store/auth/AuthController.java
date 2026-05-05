package com.example.store.auth;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {
        return service.login(request.getUsername(), request.getPassword());
    }

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        return service.register(request.getUsername(), request.getPassword());
    }
}