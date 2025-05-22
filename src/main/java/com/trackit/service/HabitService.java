package com.trackit.service;

import com.trackit.model.Habit;
import com.trackit.model.User;
import com.trackit.repository.HabitRepository;
import com.trackit.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;


import java.util.List;

@Service
public class HabitService {
    private final HabitRepository habitRepo;
    private final UserRepository userRepo;

    public HabitService(HabitRepository habitRepo, UserRepository userRepo){
        this.habitRepo = habitRepo;
        this.userRepo = userRepo;
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



    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user");
        }
        return authentication.getName(); // usually the email/username stored here
    }


}
