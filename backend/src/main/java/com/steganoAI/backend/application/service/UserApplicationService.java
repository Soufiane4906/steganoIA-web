package com.steganoAI.backend.application.service;

import com.steganoAI.backend.domain.model.User;
import com.steganoAI.backend.domain.service.UserDomainService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserApplicationService {
    private final UserDomainService userDomainService;
    private final PasswordEncoder passwordEncoder;

    public UserApplicationService(UserDomainService userDomainService, PasswordEncoder passwordEncoder) {
        this.userDomainService = userDomainService;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userDomainService.getAllUsers();
    }

    public Optional<User> getUserById(Long id) {
        return userDomainService.getUserById(id);
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userDomainService.save(user);
    }

    public void deleteUser(Long id) {
        userDomainService.deleteUser(id);
    }
}
