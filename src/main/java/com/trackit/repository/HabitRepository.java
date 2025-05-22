package com.trackit.repository;

import com.trackit.model.Habit;
import com.trackit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUser(User user);
    Optional<Habit> findById(Long id);
}
