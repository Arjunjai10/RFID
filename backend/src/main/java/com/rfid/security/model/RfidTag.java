package com.rfid.security.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rfid_tags")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class RfidTag {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag_uid", nullable = false, unique = true, length = 50)
    private String tagUid;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "tag_type", length = 30)
    private TagType tagType = TagType.MIFARE_CLASSIC;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;                    // null = unassigned

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TagStatus status = TagStatus.UNASSIGNED;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TagType { MIFARE_CLASSIC, MIFARE_ULTRALIGHT, ISO14443A, ISO15693 }
    public enum TagStatus { ACTIVE, INACTIVE, UNASSIGNED, BLOCKED }
}
