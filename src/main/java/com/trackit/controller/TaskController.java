package com.trackit.controller;

import com.trackit.dto.TaskRequest;
import com.trackit.model.User;
import com.trackit.security.CustomUserDetails;
import com.trackit.service.TaskService;
import com.trackit.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest request,
                                        @AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userService.findById(userDetails.getId());
        return ResponseEntity.ok(taskService.createTask(request, user));
    }

    @GetMapping
    public ResponseEntity<?> getAllTasks(@AuthenticationPrincipal CustomUserDetails userDetails) {
        User user = userService.findById(userDetails.getId());
        return ResponseEntity.ok(taskService.getAllTasks(user));
    }


    @GetMapping("/today")
    public ResponseEntity<?> getTodayTasks(@AuthenticationPrincipal CustomUserDetails userDetails){
        User user = userService.findById(userDetails.getId());
        return ResponseEntity.ok(taskService.getTodayTasks(user));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getTaskHistory(@RequestParam LocalDate start, @RequestParam LocalDate end,
                                            @AuthenticationPrincipal CustomUserDetails userDetails){
        User user = userService.findById(userDetails.getId());
        return ResponseEntity.ok(taskService.getTaskHistory(user, start, end));
    }

    @GetMapping("/{id}/completed")
    public ResponseEntity<?> markComplete(@PathVariable Long id,
                                          @AuthenticationPrincipal CustomUserDetails userDetails){
        User user = userService.findById(userDetails.getId());
        return ResponseEntity.ok(taskService.markTaskComplete(id, user));
    }
}
