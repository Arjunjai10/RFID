package com.rfid.security.repository;

import com.rfid.security.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%',:search,'%'))) " +
           "AND (:status IS NULL OR u.status = :status)")
    Page<User> searchUsers(String search, User.UserStatus status, Pageable pageable);

    long countByStatus(User.UserStatus status);
}
