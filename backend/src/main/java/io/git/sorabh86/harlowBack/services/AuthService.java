package io.git.sorabh86.harlowBack.services;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.git.sorabh86.harlowBack.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    public UserRepository.StoredUser register(String name, String email, String password) {
        return users.create(name, email, passwordEncoder.encode(password));
    }

    public Optional<UserRepository.StoredUser> authenticate(String email, String password) {
        return users.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.passwordHash()));
    }

    public Optional<UserRepository.StoredUser> findById(long id) {
        return users.findById(id);
    }
}
