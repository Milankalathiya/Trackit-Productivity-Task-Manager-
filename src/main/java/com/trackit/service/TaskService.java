package com.trackit.service;

import com.trackit.dto.TaskRequest;
import com.trackit.model.User;
import com.trackit.model.Task;
import com.trackit.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public Object createTask(TaskRequest request, User user) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());
        task.setRepeatType(request.getRepeatType());
        task.setUser(user);

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(User user) {
        return taskRepository.findAllByUser(user);
    }


    public Object getTodayTasks(User user) {
        LocalDate today = LocalDate.now();
        return taskRepository.findByUserAndDueDate(user, today);
    }

    public Object getTaskHistory(User user, LocalDate start, LocalDate end) {
        return taskRepository.findByUserAndDueDateBetween(user, start, end);
    }

    public Object markTaskComplete(Long id, User user){
        Task task = taskRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Task not found"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Not allowed");
        }

        task.setCompleted(true);
        task.setCompletedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }
}
