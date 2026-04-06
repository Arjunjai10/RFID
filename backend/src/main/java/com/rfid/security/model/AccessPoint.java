package com.rfid.security.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "access_points")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AccessPoint {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String location;

    @Column(name = "reader_serial", length = 100)
    private String readerSerial;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PointType type = PointType.ENTRY_EXIT;

    @Builder.Default
    @Column(name = "access_level", length = 20)
    private String accessLevel = "ALL";

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PointStatus status = PointStatus.ONLINE;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum PointType { ENTRY_EXIT, ENTRY_ONLY, EXIT_ONLY, RESTRICTED }
    public enum PointStatus { ONLINE, OFFLINE, MAINTENANCE }

    @PreUpdate
    public void preUpdate() { this.updatedAt = LocalDateTime.now(); }
}
