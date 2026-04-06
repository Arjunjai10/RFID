package com.rfid.security.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "access_logs",
    indexes = {
        @Index(name = "idx_log_timestamp", columnList = "timestamp"),
        @Index(name = "idx_log_tag",       columnList = "tag_uid"),
    })
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AccessLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag_uid", nullable = false, length = 50)
    private String tagUid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;                      // null if unknown tag

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "access_point_id", nullable = false)
    private AccessPoint accessPoint;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AccessStatus status;            // GRANTED, DENIED, TIMEOUT

    @Column(name = "denial_reason", length = 255)
    private String denialReason;

    @Column(name = "reader_ip", length = 45)
    private String readerIp;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public enum AccessStatus { GRANTED, DENIED, TIMEOUT }
}
