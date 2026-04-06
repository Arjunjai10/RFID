package com.rfid.security.controller;

import com.rfid.security.model.AccessLog;
import com.rfid.security.repository.AccessLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/access-logs")
@RequiredArgsConstructor
public class AccessLogController {

    private final AccessLogRepository accessLogRepository;

    @GetMapping
    public Page<AccessLog> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return accessLogRepository.findAllByOrderByTimestampDesc(
                PageRequest.of(page, size));
    }

    @GetMapping("/recent")
    public ResponseEntity<?> recent(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(accessLogRepository.findTop10ByOrderByTimestampDesc());
    }
}
