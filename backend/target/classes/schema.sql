-- ════════════════════════════════════════════════════════════════════════
--  RFID-Based Security System — MySQL Database Schema
--  Version: 1.0   |   Engine: InnoDB   |   Charset: utf8mb4
-- ════════════════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS rfid_security CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rfid_security;

-- ── Roles ──────────────────────────────────────────────────────────────
CREATE TABLE roles (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50)  NOT NULL UNIQUE,   -- SUPER_ADMIN, ADMIN, EMPLOYEE
    description VARCHAR(255),
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Users ──────────────────────────────────────────────────────────────
CREATE TABLE users (
    id             BIGINT       AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    department     VARCHAR(100),
    role_id        BIGINT       NOT NULL,
    status         ENUM('ACTIVE','INACTIVE','LOCKED') DEFAULT 'ACTIVE',
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- ── RFID Tags ──────────────────────────────────────────────────────────
CREATE TABLE rfid_tags (
    id             BIGINT       AUTO_INCREMENT PRIMARY KEY,
    tag_uid        VARCHAR(50)  NOT NULL UNIQUE,          -- e.g. TAG-0042 or raw UID
    tag_type       ENUM('MIFARE_CLASSIC','MIFARE_ULTRALIGHT','ISO14443A','ISO15693') DEFAULT 'MIFARE_CLASSIC',
    user_id        BIGINT,                                -- NULL = unassigned
    status         ENUM('ACTIVE','INACTIVE','UNASSIGNED','BLOCKED') DEFAULT 'UNASSIGNED',
    assigned_at    TIMESTAMP    NULL,
    last_used_at   TIMESTAMP    NULL,
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tag_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Access Points (RFID Readers / Zones) ──────────────────────────────
CREATE TABLE access_points (
    id             BIGINT       AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    location       VARCHAR(255),
    reader_serial  VARCHAR(100),              -- Hardware reader identifier
    type           ENUM('ENTRY_EXIT','ENTRY_ONLY','EXIT_ONLY','RESTRICTED') DEFAULT 'ENTRY_EXIT',
    access_level   ENUM('ALL','STAFF','IT_ADMIN','ADMIN','SUPER_ADMIN') DEFAULT 'ALL',
    status         ENUM('ONLINE','OFFLINE','MAINTENANCE') DEFAULT 'ONLINE',
    ip_address     VARCHAR(45),
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Access Logs ────────────────────────────────────────────────────────
CREATE TABLE access_logs (
    id               BIGINT       AUTO_INCREMENT PRIMARY KEY,
    tag_uid          VARCHAR(50)  NOT NULL,
    user_id          BIGINT,                             -- NULL for unknown tags
    access_point_id  BIGINT       NOT NULL,
    status           ENUM('GRANTED','DENIED','TIMEOUT')  NOT NULL,
    denial_reason    VARCHAR(255),                       -- e.g. "TAG_INACTIVE", "UNAUTHORIZED_ZONE"
    reader_ip        VARCHAR(45),
    timestamp        TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_log_timestamp (timestamp),
    INDEX idx_log_tag (tag_uid),
    INDEX idx_log_user (user_id),
    INDEX idx_log_point (access_point_id),
    CONSTRAINT fk_log_user    FOREIGN KEY (user_id)         REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_log_point   FOREIGN KEY (access_point_id) REFERENCES access_points(id)
) ENGINE=InnoDB;

-- ── Security Alerts ────────────────────────────────────────────────────
CREATE TABLE alerts (
    id               BIGINT       AUTO_INCREMENT PRIMARY KEY,
    type             ENUM('UNAUTHORIZED_ACCESS','READER_OFFLINE','TAILGATING','SYSTEM_ERROR','CARD_CLONED') NOT NULL,
    severity         ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
    message          TEXT         NOT NULL,
    access_point_id  BIGINT,
    tag_uid          VARCHAR(50),
    acknowledged     BOOLEAN      DEFAULT FALSE,
    acknowledged_by  BIGINT,
    acknowledged_at  TIMESTAMP    NULL,
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_alert_created (created_at),
    INDEX idx_alert_acked   (acknowledged),
    CONSTRAINT fk_alert_point FOREIGN KEY (access_point_id) REFERENCES access_points(id) ON DELETE SET NULL,
    CONSTRAINT fk_alert_ack   FOREIGN KEY (acknowledged_by)  REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Access Rules (zone permissions per role) ───────────────────────────
CREATE TABLE access_rules (
    id               BIGINT       AUTO_INCREMENT PRIMARY KEY,
    access_point_id  BIGINT       NOT NULL,
    role_id          BIGINT       NOT NULL,
    allowed          BOOLEAN      DEFAULT TRUE,
    time_from        TIME,        -- Optional time-based access (NULL = always)
    time_to          TIME,
    days_mask        TINYINT,     -- bitmask: Mon=1,Tue=2,Wed=4,...,Sun=64
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_rule (access_point_id, role_id),
    CONSTRAINT fk_rule_point FOREIGN KEY (access_point_id) REFERENCES access_points(id) ON DELETE CASCADE,
    CONSTRAINT fk_rule_role  FOREIGN KEY (role_id)          REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Admin Audit Log ────────────────────────────────────────────────────
CREATE TABLE audit_logs (
    id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
    admin_id     BIGINT       NOT NULL,
    action       VARCHAR(100) NOT NULL,  -- e.g. "CREATE_USER", "ASSIGN_TAG"
    target_type  VARCHAR(50),            -- e.g. "USER", "TAG", "ACCESS_POINT"
    target_id    BIGINT,
    details      JSON,
    ip_address   VARCHAR(45),
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ════════════════════════════════════════════════════════════════════════

-- Roles
INSERT INTO roles (name, description) VALUES
('SUPER_ADMIN', 'Full system access'),
('ADMIN',       'Administrative access, can manage users and tags'),
('EMPLOYEE',    'Standard employee RFID access');

-- Users (passwords are bcrypt hashes — default: admin123 / pass123)
INSERT INTO users (name, email, password_hash, department, role_id, status) VALUES
('System Administrator', 'admin@rfid.local',   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'IT',         1, 'ACTIVE'),
('Rahul Verma',          'rahul@rfid.local',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Security',   2, 'ACTIVE'),
('Arjun Kumar',          'arjun@rfid.local',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'IT',         3, 'ACTIVE'),
('Priya Sharma',         'priya@rfid.local',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'HR',         3, 'ACTIVE'),
('Sneha Nair',           'sneha@rfid.local',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Finance',    3, 'ACTIVE'),
('Dev Patel',            'dev@rfid.local',      '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'Operations', 3, 'ACTIVE');

-- RFID Tags
INSERT INTO rfid_tags (tag_uid, tag_type, user_id, status, assigned_at) VALUES
('TAG-0001', 'MIFARE_CLASSIC',     1, 'ACTIVE',    NOW()),
('TAG-0031', 'MIFARE_ULTRALIGHT',  2, 'ACTIVE',    NOW()),
('TAG-0042', 'MIFARE_CLASSIC',     3, 'ACTIVE',    NOW()),
('TAG-0017', 'MIFARE_CLASSIC',     4, 'ACTIVE',    NOW()),
('TAG-0081', 'MIFARE_CLASSIC',     5, 'ACTIVE',    NOW()),
('TAG-0012', 'ISO14443A',          6, 'ACTIVE',    NOW()),
('TAG-0099', 'MIFARE_CLASSIC',  NULL, 'UNASSIGNED', NULL),
('TAG-0205', 'ISO14443A',       NULL, 'UNASSIGNED', NULL);

-- Access Points
INSERT INTO access_points (name, location, reader_serial, type, access_level, status, ip_address) VALUES
('Main Gate',    'Building A - Entry',       'RDR-001', 'ENTRY_EXIT', 'ALL',        'ONLINE',  '192.168.1.10'),
('Server Room A','IT Block, Floor 2',        'RDR-002', 'RESTRICTED', 'IT_ADMIN',   'ONLINE',  '192.168.1.11'),
('Lab Block B',  'Science Wing, Floor 1',   'RDR-003', 'ENTRY_EXIT', 'STAFF',      'ONLINE',  '192.168.1.12'),
('Admin Wing',   'Building B, Floor 3',      'RDR-004', 'RESTRICTED', 'ADMIN',      'OFFLINE', '192.168.1.13'),
('Library',      'Central Block',            'RDR-005', 'ENTRY_EXIT', 'ALL',        'ONLINE',  '192.168.1.14'),
('Cafeteria',    'Ground Floor Block C',     'RDR-006', 'ENTRY_EXIT', 'ALL',        'ONLINE',  '192.168.1.15');

-- Access Rules
INSERT INTO access_rules (access_point_id, role_id, allowed, days_mask) VALUES
(1, 1, TRUE, 127), (1, 2, TRUE, 127), (1, 3, TRUE, 62),  -- Main Gate: all roles, employees Mon-Fri
(2, 1, TRUE, 127), (2, 2, TRUE, 127), (2, 3, FALSE, 0),   -- Server Room: admin only
(3, 1, TRUE, 127), (3, 2, TRUE, 127), (3, 3, TRUE, 62),   -- Lab Block: all Mon-Fri
(4, 1, TRUE, 127), (4, 2, TRUE, 127), (4, 3, FALSE, 0),   -- Admin Wing: admin only
(5, 1, TRUE, 127), (5, 2, TRUE, 127), (5, 3, TRUE, 127),  -- Library: all
(6, 1, TRUE, 127), (6, 2, TRUE, 127), (6, 3, TRUE, 127);  -- Cafeteria: all

-- Sample Access Logs
INSERT INTO access_logs (tag_uid, user_id, access_point_id, status, timestamp) VALUES
('TAG-0042', 3, 1, 'GRANTED', NOW() - INTERVAL 2 HOUR),
('TAG-0099', NULL, 3, 'DENIED', NOW() - INTERVAL 90 MINUTE),
('TAG-0017', 4, 1, 'GRANTED', NOW() - INTERVAL 80 MINUTE),
('TAG-0031', 2, 1, 'GRANTED', NOW() - INTERVAL 70 MINUTE),
('TAG-0055', NULL, 4, 'DENIED', NOW() - INTERVAL 60 MINUTE),
('TAG-0081', 5, 6, 'GRANTED', NOW() - INTERVAL 50 MINUTE),
('TAG-0012', 6, 2, 'GRANTED', NOW() - INTERVAL 40 MINUTE);

-- Sample Alerts
INSERT INTO alerts (type, severity, message, access_point_id, tag_uid) VALUES
('UNAUTHORIZED_ACCESS', 'HIGH',   'Multiple failed access attempts at Admin Wing', 4, 'TAG-0099'),
('READER_OFFLINE',      'MEDIUM', 'RFID Reader at Admin Wing has gone offline',    4, NULL),
('UNAUTHORIZED_ACCESS', 'HIGH',   'Unknown tag presented at Server Room A',        2, 'TAG-0055');
