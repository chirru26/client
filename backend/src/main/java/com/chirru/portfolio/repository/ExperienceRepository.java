package com.chirru.portfolio.repository;

import com.chirru.portfolio.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findAllByOrderByDisplayOrderAscStartDateDesc();
}
