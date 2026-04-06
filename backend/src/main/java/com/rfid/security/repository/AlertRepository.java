package com.rfid.security.repository;

import com.rfid.security.model.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    Page<Alert> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Alert> findByAcknowledgedFalseOrderByCreatedAtDesc();
    long countByAcknowledgedFalse();
}
