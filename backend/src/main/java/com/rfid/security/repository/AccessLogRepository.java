package com.rfid.security.repository;

import com.rfid.security.model.AccessLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {

    Page<AccessLog> findAllByOrderByTimestampDesc(Pageable pageable);

    List<AccessLog> findTop10ByOrderByTimestampDesc();

    @Query("SELECT a FROM AccessLog a WHERE " +
           "(:tagUid IS NULL OR a.tagUid LIKE CONCAT('%',:tagUid,'%')) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:from IS NULL OR a.timestamp >= :from) AND " +
           "(:to IS NULL OR a.timestamp <= :to) " +
           "ORDER BY a.timestamp DESC")
    Page<AccessLog> searchLogs(@Param("tagUid") String tagUid,
                                @Param("status") AccessLog.AccessStatus status,
                                @Param("from") LocalDateTime from,
                                @Param("to") LocalDateTime to,
                                Pageable pageable);

    long countByTimestampAfter(LocalDateTime since);
    long countByStatusAndTimestampAfter(AccessLog.AccessStatus status, LocalDateTime since);
}
