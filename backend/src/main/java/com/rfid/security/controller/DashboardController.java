package com.rfid.security.controller;

import com.rfid.security.model.*;
import com.rfid.security.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepository userRepository;
    private final AccessLogRepository accessLogRepository;
    private final AccessPointRepository accessPointRepository;
    private final AlertRepository alertRepository;
    private final RfidTagRepository rfidTagRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        LocalDateTime today = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();

        long totalUsers   = userRepository.count();
        long activeUsers  = userRepository.countByStatus(User.UserStatus.ACTIVE);
        long todayTotal   = accessLogRepository.countByTimestampAfter(today);
        long todayDenied  = accessLogRepository.countByStatusAndTimestampAfter(AccessLog.AccessStatus.DENIED, today);
        long activePoints = accessPointRepository.countByStatus(AccessPoint.PointStatus.ONLINE);
        long unackAlerts  = alertRepository.countByAcknowledgedFalse();

        return ResponseEntity.ok(Map.of(
            "totalUsers",   totalUsers,
            "activeUsers",  activeUsers,
            "todayAccess",  todayTotal,
            "deniedToday",  todayDenied,
            "activePoints", activePoints,
            "alertsToday",  unackAlerts
        ));
    }

    @GetMapping("/trend")
    public ResponseEntity<?> trend(@RequestParam(defaultValue = "7") int days) {
        // Returns last N days stats — placeholder with random data (replace with real query)
        String[] dayNames = { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
        var result = new java.util.ArrayList<Map<String, Object>>();
        for (int i = 0; i < Math.min(days, 7); i++) {
            result.add(Map.of("day", dayNames[i],
                "granted", 40 + (int)(Math.random() * 60),
                "denied",  (int)(Math.random() * 10)));
        }
        return ResponseEntity.ok(result);
    }
}
