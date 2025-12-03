package com.dealspot.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ← AJOUTER CETTE LIGNE
public class DealspotBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DealspotBackendApplication.class, args);
    }
}