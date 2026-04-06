package com.rfid.security.controller;

import com.rfid.security.model.*;
import com.rfid.security.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/rfid")
@RequiredArgsConstructor
public class RfidScanController {

    private final RfidTagRepository rfidTagRepository;
    private final AccessPointRepository accessPointRepository;
    private final AccessLogRepository accessLogRepository;
    private final AlertRepository alertRepository;

    /**
     * Main endpoint called by RFID hardware reader on every scan.
     * POST /api/rfid/scan   (public — no JWT needed, called by IoT device)
     */
    @PostMapping("/scan")
    public ResponseEntity<ScanResponse> scan(@RequestBody ScanRequest req) {
        long start = System.currentTimeMillis();

        AccessPoint ap = accessPointRepository.findById(req.getAccessPointId()).orElse(null);
        if (ap == null) {
            return ResponseEntity.badRequest().body(new ScanResponse("DENIED", "Unknown access point", 0));
        }

        RfidTag tag = rfidTagRepository.findByTagUid(req.getTagUid()).orElse(null);

        AccessLog.AccessStatus status;
        String denialReason = null;
        User user = null;

        if (tag == null || tag.getStatus() == RfidTag.TagStatus.UNASSIGNED || tag.getUser() == null) {
            status = AccessLog.AccessStatus.DENIED;
            denialReason = "UNKNOWN_TAG";
        } else if (tag.getStatus() == RfidTag.TagStatus.BLOCKED || tag.getStatus() == RfidTag.TagStatus.INACTIVE) {
            status = AccessLog.AccessStatus.DENIED;
            denialReason = "TAG_INACTIVE";
        } else if (tag.getUser().getStatus() != User.UserStatus.ACTIVE) {
            status = AccessLog.AccessStatus.DENIED;
            denialReason = "USER_INACTIVE";
        } else {
            // Role-based zone check: simplified — in production consult access_rules table
            String userRole = tag.getUser().getRole().getName();
            String requiredLevel = ap.getAccessLevel();
            status = isAuthorized(userRole, requiredLevel) ? AccessLog.AccessStatus.GRANTED : AccessLog.AccessStatus.DENIED;
            if (status == AccessLog.AccessStatus.DENIED) denialReason = "UNAUTHORIZED_ZONE";
            else user = tag.getUser();
        }

        // Update tag last used
        if (tag != null) { tag.setLastUsedAt(LocalDateTime.now()); rfidTagRepository.save(tag); }

        // Persist log
        accessLogRepository.save(AccessLog.builder()
            .tagUid(req.getTagUid())
            .user(user)
            .accessPoint(ap)
            .status(status)
            .denialReason(denialReason)
            .readerIp(req.getReaderIp())
            .timestamp(LocalDateTime.now())
            .build());

        // Create alert on denial
        if (status == AccessLog.AccessStatus.DENIED) {
            alertRepository.save(Alert.builder()
                .type(Alert.AlertType.UNAUTHORIZED_ACCESS)
                .severity(Alert.Severity.HIGH)
                .message("Unauthorized access attempt at " + ap.getName() + " with tag " + req.getTagUid())
                .accessPoint(ap)
                .tagUid(req.getTagUid())
                .build());
        }

        long elapsed = System.currentTimeMillis() - start;
        String username = user != null ? user.getName() : "Unknown";
        return ResponseEntity.ok(new ScanResponse(status.name(), username, elapsed));
    }

    private boolean isAuthorized(String userRole, String requiredLevel) {
        if ("ALL".equals(requiredLevel)) return true;
        return switch (requiredLevel) {
            case "STAFF" -> List.of("EMPLOYEE","ADMIN","SUPER_ADMIN").contains(userRole);
            case "IT_ADMIN" -> List.of("ADMIN","SUPER_ADMIN").contains(userRole) || "IT".equals(userRole);
            case "ADMIN" -> List.of("ADMIN","SUPER_ADMIN").contains(userRole);
            case "SUPER_ADMIN" -> "SUPER_ADMIN".equals(userRole);
            default -> false;
        };
    }

    @Data
    public static class ScanRequest {
        private String tagUid;
        private Long accessPointId;
        private String readerIp;
    }

    @Data
    public static class ScanResponse {
        private final String status;
        private final String userName;
        private final long responseTimeMs;
    }
}
