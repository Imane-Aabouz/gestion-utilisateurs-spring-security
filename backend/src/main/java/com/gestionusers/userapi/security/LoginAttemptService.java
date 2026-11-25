package com.gestionusers.userapi.security;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

/**
 * Limitation simple des tentatives de connexion (anti brute-force) :
 * 5 échecs consécutifs par email => blocage 15 minutes.
 * Stockage en mémoire : suffisant pour un projet, à remplacer par Redis en production.
 */
@Component
public class LoginAttemptService {

    private static final int MAX_FAILURES = 5;
    private static final Duration LOCK_DURATION = Duration.ofMinutes(15);

    private record Attempt(int failures, Instant lockedUntil) {}

    private final Map<String, Attempt> attempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String email) {
        Attempt a = attempts.get(key(email));
        if (a == null || a.lockedUntil() == null) return false;
        if (Instant.now().isAfter(a.lockedUntil())) {
            attempts.remove(key(email));
            return false;
        }
        return true;
    }

    public void recordFailure(String email) {
        attempts.merge(key(email), new Attempt(1, null), (old, ignored) -> {
            int n = old.failures() + 1;
            return new Attempt(n, n >= MAX_FAILURES ? Instant.now().plus(LOCK_DURATION) : null);
        });
    }

    public void recordSuccess(String email) {
        attempts.remove(key(email));
    }

    private String key(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
