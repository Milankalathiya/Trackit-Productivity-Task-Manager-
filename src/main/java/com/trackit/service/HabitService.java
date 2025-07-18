package com.trackit.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.trackit.dto.HabitWithStreakDTO;
import com.trackit.model.Habit;
import com.trackit.model.User;
import com.trackit.repository.HabitRepository;
import com.trackit.repository.UserRepository;

@Service
public class HabitService {
    private final HabitRepository habitRepo;
    private final UserRepository userRepo;
    private final HabitLogService habitLogService;

    public HabitService(HabitRepository habitRepo, UserRepository userRepo, HabitLogService habitLogService){
        this.habitRepo = habitRepo;
        this.userRepo = userRepo;
        this.habitLogService = habitLogService;
    }

    public Habit addHabit(Habit habit) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        habit.setUser(user);
        return habitRepo.save(habit);
    }

    public List<Habit> getHabits(User user) {
        return habitRepo.findByUser(user);
    }

    public List<HabitWithStreakDTO> getHabitsWithStreak(User user) {
        List<Habit> habits = habitRepo.findByUser(user);
        return habits.stream()
                .map(habit -> new HabitWithStreakDTO(habit, habitLogService.getCurrentStreak(habit)))
                .collect(Collectors.toList());
    }

    public void deleteHabit(Long habitId, User user) {
        Habit habit = habitRepo.findById(habitId)
                .filter(h -> h.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Habit not found or not yours"));
        // Delete associated logs if needed (handled by cascade or manually)
        habitRepo.delete(habit);
    }


    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user");
        }
        return authentication.getName(); // usually the email/username stored here
    }


}
