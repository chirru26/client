package com.chirru.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PortfolioApplication {
    public static void main(String[] args) {
        System.out.println("Starting Backend Application Run On http://localhost:8080/api/v2 ...");
        SpringApplication.run(PortfolioApplication.class, args);
    }
}
