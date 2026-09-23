package com.chirru.portfolio.repository;

import com.chirru.portfolio.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
