package com.trackit.controller;

import com.trackit.model.Habit;
import com.trackit.model.HabitLog;
import com.trackit.model.User;
import com.trackit.repository.HabitRepository;
import com.trackit.repository.UserRepository;
import com.trackit.service.HabitLogService;
import com.trackit.service.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/habits")
public class HabitLogController {
    private final HabitLogService habitLogService;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    public HabitLogController(HabitLogService habitLogService, HabitRepository habitRepository, UserRepository userRepository) {
        this.habitLogService = habitLogService;
        this.habitRepository = habitRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{id}/log")
    public ResponseEntity<?> logHabit(@PathVariable Long id, Principal principal) {
        try {
            HabitLog log = habitLogService.logHabit(id, principal.getName());
            return ResponseEntity.ok(log);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Habit already logged today")) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}/streak")
    public ResponseEntity<?> getStreak(@PathVariable Long id, Principal principal) {
        Habit habit = validateOwnership(id, principal.getName());
        int streak = habitLogService.getCurrentStreak(habit);
        return ResponseEntity.ok(Map.of("currentStreak", streak));
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<?> getWeeklyProgress(@PathVariable Long id, Principal principal) {
        Habit habit = validateOwnership(id, principal.getName());
        Map<String, Long> progress = habitLogService.getWeeklyProgress(habit);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<HabitLog>> getHabitLogs(@PathVariable Long id, Principal principal) {
        Habit habit = validateOwnership(id, principal.getName());
        List<HabitLog> logs = habitLogService.getLogsForHabit(habit);
        return ResponseEntity.ok(logs);
    }

    private Habit validateOwnership(Long habitId, String username) {
        User user = (User) userRepository.findByUsername(username).orElseThrow();
        return habitRepository.findById(habitId)
                .filter(h -> h.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Habit not found or not yours"));
    }
}

