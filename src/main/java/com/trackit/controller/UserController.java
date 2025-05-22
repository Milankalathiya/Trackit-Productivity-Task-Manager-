package com.trackit.controller;

import com.trackit.dto.LoginRequest;
import com.trackit.model.User;
import com.trackit.repository.UserRepository;
import com.trackit.security.CustomUserDetails;
import com.trackit.security.JwtUtil;
import com.trackit.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        System.out.println("Received password: " + user.getPassword());
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }

        if (user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Password cannot be null");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // 🔐 hash password
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser); // password will be hidden due to @JsonIgnore
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid Credentials");
        }

        // Create UserDetails (CustomUserDetails) from User
        CustomUserDetails customUserDetails = new CustomUserDetails(user);

        // Generate token using UserDetails
        String token = jwtUtil.generateToken(customUserDetails);

        return ResponseEntity.ok().body("Bearer " + token);
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        String username = authentication.getName(); // Extracted from JWT
        Optional<User> optionalUser = userService.findByUsername(username);

        if (optionalUser.isPresent()) {
            return ResponseEntity.ok(optionalUser.get());
        } else {
            // User not found - return 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }



}
