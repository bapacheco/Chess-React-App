package com.bapachec.chess_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication()
public class ChessApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChessApiApplication.class, args);
	}

}
