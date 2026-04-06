package com.rfid.security.repository;

import com.rfid.security.model.RfidTag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RfidTagRepository extends JpaRepository<RfidTag, Long> {
    Optional<RfidTag> findByTagUid(String tagUid);
    boolean existsByTagUid(String tagUid);
    long countByStatus(RfidTag.TagStatus status);
}
