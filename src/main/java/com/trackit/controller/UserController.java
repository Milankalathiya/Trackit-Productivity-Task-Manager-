package com.trackit.controller;

import com.trackit.dto.LoginRequest;
import com.trackit.model.User;
import com.trackit.security.CustomUserDetails;
import com.trackit.security.JwtUtil;
import com.trackit.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user){
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid Credentials");
        }

        // Create UserDetails (CustomUserDetails) from User
        CustomUserDetails customUserDetails = new CustomUserDetails(user);

        // Generate token using UserDetails
        String token = jwtUtil.generateToken(customUserDetails);

        return ResponseEntity.ok().body("Bearer " + token);
    }


}
