package com.trackit.controller;

import java.security.Principal;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trackit.dto.HabitWithStreakDTO;
import com.trackit.model.Habit;
import com.trackit.model.User;
import com.trackit.repository.UserRepository;
import com.trackit.service.HabitService;

@RestController
@RequestMapping("/api/habits")
public class HabitController {
    private final HabitService habitService;
    private final UserRepository userRepository; // add this

    public HabitController(HabitService habitService, UserRepository userRepository){
        this.habitService = habitService;
        this.userRepository = userRepository;
    }

    // ... existing code ...
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHabit(@PathVariable Long id, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        habitService.deleteHabit(id, user);
        return ResponseEntity.ok().body(Map.of("message", "Habit deleted successfully"));
    }
// ... existing code ...

    @PostMapping
    public ResponseEntity<?> createHabit(@RequestBody Habit habit, Principal principal) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        habit.setUser(user);
        habitService.addHabit(habit);

        return ResponseEntity.status(HttpStatus.CREATED).body(habit);
    }


    @GetMapping
    public ResponseEntity<List<HabitWithStreakDTO>> getHabits(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found: " + principal.getName()));

        return ResponseEntity.ok(habitService.getHabitsWithStreak(user));
    }


}
