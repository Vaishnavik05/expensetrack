package com.expensetracker.controller;

import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        
        if (userRepository.findByName(user.getName()).isPresent()) {
            response.put("error", "Username already exists");
            return response;
        }
        
        // Store password as-is (no hashing)
        userRepository.save(user);
        
        response.put("message", "User registered successfully");
        return response;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> data) {
        String name = data.get("name");
        String password = data.get("password");
        
        System.out.println("Login attempt - Username: " + name);
        
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Direct password comparison (no hashing)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        
        String token = jwtUtil.generateToken(user.getName());
        
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getName());
        
        System.out.println("✓ Login successful for: " + name);
        System.out.println("✓ Token generated: " + token.substring(0, 20) + "...");
        
        return response;
    }
}
