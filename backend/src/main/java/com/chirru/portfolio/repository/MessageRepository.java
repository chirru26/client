package com.chirru.portfolio.repository;

import com.chirru.portfolio.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findAllByOrderByCreatedAtDesc();
    long countByReadFalse();
}
