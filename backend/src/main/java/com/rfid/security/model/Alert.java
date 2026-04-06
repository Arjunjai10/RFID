package com.rfid.security.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Alert {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AlertType type;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Severity severity = Severity.MEDIUM;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "access_point_id")
    private AccessPoint accessPoint;

    @Column(name = "tag_uid", length = 50)
    private String tagUid;

    @Column(nullable = false)
    private Boolean acknowledged = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acknowledged_by")
    private User acknowledgedBy;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum AlertType { UNAUTHORIZED_ACCESS, READER_OFFLINE, TAILGATING, SYSTEM_ERROR, CARD_CLONED }
    public enum Severity { LOW, MEDIUM, HIGH, CRITICAL }
}
