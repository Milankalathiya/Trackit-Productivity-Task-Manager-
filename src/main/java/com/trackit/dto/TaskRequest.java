package com.trackit.dto;

import com.trackit.model.Priority;
import com.trackit.model.RepeatType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private Priority priority;
    private RepeatType repeatType;
}
