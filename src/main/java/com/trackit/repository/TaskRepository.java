package com.trackit.repository;

import com.trackit.model.Task;
import com.trackit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserAndDueDate(User user, LocalDate dueDate);
    List<Task> findByUserAndDueDateBetween(User user, LocalDate start, LocalDate end);
    List<Task> findAllByUser(User user);
    Optional<Task> findByIdAndUser(Long id, User user);
}
