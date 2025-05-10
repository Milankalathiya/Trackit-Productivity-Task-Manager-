package com.trackit.service;

import com.trackit.model.User;
import com.trackit.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user){
        return userRepository.save(user);
    }



    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        // Extract the User from Optional
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElse(null); // Handle null case, in case no user is found
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}

