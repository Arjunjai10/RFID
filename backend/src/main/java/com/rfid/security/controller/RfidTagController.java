package com.rfid.security.controller;

import com.rfid.security.model.*;
import com.rfid.security.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
public class RfidTagController {

    private final RfidTagRepository rfidTagRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<RfidTag> getTags() {
        return rfidTagRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<RfidTag> register(@RequestBody TagRequest req) {
        if (rfidTagRepository.existsByTagUid(req.getTagUid())) {
            return ResponseEntity.badRequest().build();
        }
        RfidTag tag = RfidTag.builder()
            .tagUid(req.getTagUid().toUpperCase())
            .tagType(req.getTagType() != null ? RfidTag.TagType.valueOf(req.getTagType()) : RfidTag.TagType.MIFARE_CLASSIC)
            .status(RfidTag.TagStatus.UNASSIGNED)
            .build();
        return ResponseEntity.ok(rfidTagRepository.save(tag));
    }

    @PutMapping("/{id}/assign/{userId}")
    public ResponseEntity<RfidTag> assign(@PathVariable Long id, @PathVariable Long userId) {
        RfidTag tag = rfidTagRepository.findById(id).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        tag.setUser(user);
        tag.setStatus(RfidTag.TagStatus.ACTIVE);
        tag.setAssignedAt(LocalDateTime.now());
        return ResponseEntity.ok(rfidTagRepository.save(tag));
    }

    @PutMapping("/{id}/unassign")
    public ResponseEntity<RfidTag> unassign(@PathVariable Long id) {
        RfidTag tag = rfidTagRepository.findById(id).orElseThrow();
        tag.setUser(null);
        tag.setStatus(RfidTag.TagStatus.UNASSIGNED);
        tag.setAssignedAt(null);
        return ResponseEntity.ok(rfidTagRepository.save(tag));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        rfidTagRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class TagRequest {
        private String tagUid;
        private String tagType;
    }
}
