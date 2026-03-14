package com.aluon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.modulith.Modulith;

@Modulith
@SpringBootApplication
public class AluonApplication {

    public static void main(String[] args) {
        SpringApplication.run(AluonApplication.class, args);
    }
}
