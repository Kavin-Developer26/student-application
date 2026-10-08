package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
        System.out.println("\n========================================================");
        System.out.println(" Student Registration App Started Successfully! ");
        System.out.println(" Home / Web Form:   http://localhost:8080/ ");
        System.out.println(" Thymeleaf Register: http://localhost:8080/register ");
        System.out.println(" H2 Database Console: http://localhost:8080/h2-console ");
        System.out.println(" REST API Endpoint:  http://localhost:8080/api/students ");
        System.out.println("========================================================\n");
    }

}
