package com.chirru.portfolio.repository;

import com.chirru.portfolio.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderByDisplayOrderAsc();
    List<Project> findByFeaturedTrueOrderByDisplayOrderAsc();
}
