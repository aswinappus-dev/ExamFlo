package com.fourbits.examflow.controller;

import java.util.HashMap; // Import
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping; // Import
import org.springframework.web.bind.annotation.RequestBody; // Import
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController; // Import

import com.fourbits.examflow.config.JwtUtil; // Import
import com.fourbits.examflow.dto.auth.LoginRequest;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil; // Inject JwtUtil

    @Autowired
    private UserDetailsService userDetailsService; // Inject UserDetailsService

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Load UserDetails to generate token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());

        // Generate the JWT token
        final String jwt = jwtUtil.generateToken(userDetails);

        // Return the token in the response body
        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", userDetails.getUsername());

        // Use ResponseEntity.ok() for standard 200 OK
        return ResponseEntity.ok(response);
    }
}