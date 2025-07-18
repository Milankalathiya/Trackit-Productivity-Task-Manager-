package com.trackit.dto;

import java.time.LocalDateTime;

import com.trackit.model.Priority;
import com.trackit.model.RepeatType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;

    private Priority priority = Priority.MEDIUM;

    private RepeatType repeatType = RepeatType.NONE;

    private String category;

    private Integer estimatedHours;

    private Integer actualHours;
}
