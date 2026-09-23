package com.chirru.portfolio.repository;

import com.chirru.portfolio.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findAllByOrderByNameAsc();
}
