package com.steganoAI.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.steganoAI.backend.domain.model.User;
import com.steganoAI.backend.domain.repository.UserRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User(null, "admin", passwordEncoder.encode("admin123"), "ADMIN");
				userRepository.save(admin);
			}
			if (userRepository.findByUsername("user").isEmpty()) {
				User user = new User(null, "user", passwordEncoder.encode("user123"), "USER");
				userRepository.save(user);
			}
		};
	}
}
