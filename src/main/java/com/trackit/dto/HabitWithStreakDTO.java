package com.trackit.dto;

import com.trackit.model.Habit;

import lombok.Data;

@Data
public class HabitWithStreakDTO {
    private Long id;
    private String name;
    private String description;
    private String frequency;
    private int streak;

    public HabitWithStreakDTO(Habit habit, int streak) {
        this.id = habit.getId();
        this.name = habit.getName();
        this.description = habit.getDescription();
        this.frequency = habit.getFrequency();
        this.streak = streak;
    }
} 