package com.rfid.security.repository;

import com.rfid.security.model.AccessPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AccessPointRepository extends JpaRepository<AccessPoint, Long> {
    List<AccessPoint> findByStatus(AccessPoint.PointStatus status);
    long countByStatus(AccessPoint.PointStatus status);
}
