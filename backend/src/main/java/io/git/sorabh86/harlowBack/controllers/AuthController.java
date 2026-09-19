package io.git.sorabh86.harlowBack.controllers;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.git.sorabh86.harlowBack.models.UserAccount;
import io.git.sorabh86.harlowBack.repository.UserRepository;
import io.git.sorabh86.harlowBack.security.SessionSecurity;
import io.git.sorabh86.harlowBack.services.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        if (request == null || isBlank(request.name()) || isBlank(request.email()) || isBlank(request.password())
                || request.password().length() < 8) {
            return error("Use a name, a valid email, and a password with at least 8 characters.", HttpStatus.BAD_REQUEST);
        }
        try {
            var user = authService.register(request.name().trim(), request.email().trim(), request.password());
            return signIn(user, httpRequest);
        } catch (UserRepository.EmailAlreadyUsedException exception) {
            return error("An account with that email already exists.", HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request, HttpServletRequest httpRequest) {
        if (request == null || isBlank(request.email()) || isBlank(request.password())) {
            return error("Enter your email and password.", HttpStatus.BAD_REQUEST);
        }
        var user = authService.authenticate(request.email().trim(), request.password());
        if (user.isEmpty()) {
            return error("That email and password combination is not recognised.", HttpStatus.UNAUTHORIZED);
        }
        return signIn(user.get(), httpRequest);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpSession session) {
        var userId = session.getAttribute(SessionSecurity.USER_ID_ATTRIBUTE);
        if (!(userId instanceof Long id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return authService.findById(id)
                .map(user -> ResponseEntity.ok(new UserAccount(user.id(), user.name(), user.email())))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<UserAccount> signIn(UserRepository.StoredUser user, HttpServletRequest request) {
        request.getSession(true);
        request.changeSessionId();
        request.getSession().setAttribute(SessionSecurity.USER_ID_ATTRIBUTE, user.id());
        return ResponseEntity.ok(new UserAccount(user.id(), user.name(), user.email()));
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static ResponseEntity<Map<String, String>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status).body(Map.of("message", message));
    }

    public record AuthRequest(String name, String email, String password) {
    }
}