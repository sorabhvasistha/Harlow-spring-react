package io.git.sorabh86.harlowBack.repository;

import java.util.Locale;
import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
                )
                """);
    }

    public Optional<StoredUser> findByEmail(String email) {
        var users = jdbcTemplate.query(
                "SELECT id, name, email, password_hash FROM users WHERE email = ?",
                (resultSet, rowNumber) -> new StoredUser(
                        resultSet.getLong("id"),
                        resultSet.getString("name"),
                        resultSet.getString("email"),
                        resultSet.getString("password_hash")),
                email.toLowerCase(Locale.ROOT));
        return users.stream().findFirst();
    }

    public Optional<StoredUser> findById(long id) {
        var users = jdbcTemplate.query(
                "SELECT id, name, email, password_hash FROM users WHERE id = ?",
                (resultSet, rowNumber) -> new StoredUser(
                        resultSet.getLong("id"),
                        resultSet.getString("name"),
                        resultSet.getString("email"),
                        resultSet.getString("password_hash")),
                id);
        return users.stream().findFirst();
    }

    public StoredUser create(String name, String email, String passwordHash) {
        var normalizedEmail = email.toLowerCase(Locale.ROOT);
        if (findByEmail(normalizedEmail).isPresent()) {
            throw new EmailAlreadyUsedException();
        }
        jdbcTemplate.update(
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
                name, normalizedEmail, passwordHash);
        return findByEmail(email).orElseThrow();
    }

    public record StoredUser(long id, String name, String email, String passwordHash) {
    }

    public static class EmailAlreadyUsedException extends RuntimeException {
    }
}