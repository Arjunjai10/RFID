package com.rfid.security.controller;

import com.rfid.security.model.Alert;
import com.rfid.security.repository.AlertRepository;
import com.rfid.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    @GetMapping
    public Page<Alert> getAlerts(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "20") int size) {
        return alertRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<Alert> acknowledge(@PathVariable Long id,
                                              @AuthenticationPrincipal UserDetails principal) {
        return alertRepository.findById(id).map(a -> {
            a.setAcknowledged(true);
            a.setAcknowledgedAt(LocalDateTime.now());
            userRepository.findByEmail(principal.getUsername()).ifPresent(a::setAcknowledgedBy);
            return ResponseEntity.ok(alertRepository.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/unacknowledged/count")
    public ResponseEntity<Map<String, Long>> unacknowledgedCount() {
        return ResponseEntity.ok(Map.of("count", alertRepository.countByAcknowledgedFalse()));
    }
}
