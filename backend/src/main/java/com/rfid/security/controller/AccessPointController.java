package com.rfid.security.controller;

import com.rfid.security.model.AccessPoint;
import com.rfid.security.repository.AccessPointRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/access-points")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
public class AccessPointController {

    private final AccessPointRepository accessPointRepository;

    @GetMapping
    public List<AccessPoint> getAll() { return accessPointRepository.findAll(); }

    @PostMapping
    public ResponseEntity<AccessPoint> create(@RequestBody PointRequest req) {
        AccessPoint ap = AccessPoint.builder()
            .name(req.getName())
            .location(req.getLocation())
            .readerSerial(req.getReaderSerial())
            .type(req.getType() != null ? AccessPoint.PointType.valueOf(req.getType()) : AccessPoint.PointType.ENTRY_EXIT)
            .accessLevel(req.getAccessLevel() != null ? req.getAccessLevel() : "ALL")
            .status(AccessPoint.PointStatus.ONLINE)
            .ipAddress(req.getIpAddress())
            .build();
        return ResponseEntity.ok(accessPointRepository.save(ap));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccessPoint> update(@PathVariable Long id, @RequestBody PointRequest req) {
        return accessPointRepository.findById(id).map(p -> {
            if (req.getName() != null)         p.setName(req.getName());
            if (req.getLocation() != null)     p.setLocation(req.getLocation());
            if (req.getAccessLevel() != null)  p.setAccessLevel(req.getAccessLevel());
            if (req.getStatus() != null)       p.setStatus(AccessPoint.PointStatus.valueOf(req.getStatus()));
            return ResponseEntity.ok(accessPointRepository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        accessPointRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class PointRequest {
        private String name, location, readerSerial, type, accessLevel, status, ipAddress;
    }
}
