package com.trackit.controller;

import com.trackit.model.HabitLog;
import com.trackit.model.User;
import com.trackit.repository.HabitLogRepository;
import com.trackit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final HabitLogRepository habitLogRepository;
    private final UserRepository userRepository;

    @GetMapping("/summary")
    public Map<String, Long> getSummary(
            Principal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        List<HabitLog> logs = habitLogRepository.findByUserAndLogDateBetween(user, startDate, endDate);

        long completed = logs.size();
        long totalDays = startDate.until(endDate).getDays() + 1;
        long pending = totalDays - completed;

        Map<String, Long> result = new HashMap<>();
        result.put("completedHabits", completed);
        result.put("pendingHabits", Math.max(pending, 0));
        return result;
    }

    @GetMapping("/consistency")
    public Map<String, Object> getConsistency(
            Principal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        List<HabitLog> logs = habitLogRepository.findByUserAndLogDateBetween(user, startDate, endDate);

        // Use a Set to track distinct days
        Set<LocalDate> loggedDays = new HashSet<>();
        for (HabitLog log : logs) {
            loggedDays.add(log.getLogDate());
        }

        long totalDays = startDate.until(endDate).getDays() + 1;
        double consistency = (double) loggedDays.size() / totalDays;

        return Map.of(
                "daysWithHabits", loggedDays.size(),
                "totalDays", totalDays,
                "consistency", String.format("%.2f", consistency)
        );
    }

    @GetMapping("/best-worst-days")
    public Map<String, Object> getBestAndWorstDays(
            Principal principal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        List<HabitLog> logs = habitLogRepository.findByUserAndLogDateBetween(user, startDate, endDate);

        Map<LocalDate, Long> countByDate = new HashMap<>();
        for (HabitLog log : logs) {
            countByDate.put(log.getLogDate(), countByDate.getOrDefault(log.getLogDate(), 0L) + 1);
        }

        String bestDay = null;
        String worstDay = null;
        long max = 0;
        long min = Long.MAX_VALUE;

        for (Map.Entry<LocalDate, Long> entry : countByDate.entrySet()) {
            long count = entry.getValue();
            if (count > max) {
                max = count;
                bestDay = entry.getKey().toString();
            }
            if (count < min) {
                min = count;
                worstDay = entry.getKey().toString();
            }
        }

        return Map.of(
                "bestDay", bestDay != null ? bestDay : "No data",
                "bestDayLogs", max,
                "worstDay", worstDay != null ? worstDay : "No data",
                "worstDayLogs", min == Long.MAX_VALUE ? 0 : min
        );
    }


}
