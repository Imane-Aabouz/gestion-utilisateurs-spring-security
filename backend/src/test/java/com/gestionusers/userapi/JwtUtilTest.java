package com.gestionusers.userapi;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.gestionusers.userapi.security.JwtUtil;

class JwtUtilTest {

    private static final String SECRET = "unit-test-secret-unit-test-secret-1234";

    @Test
    void tokenValideEtEmailExtrait() {
        JwtUtil jwt = new JwtUtil(SECRET, 60_000);
        String token = jwt.generateToken("admin@test.com", "ADMIN");
        assertTrue(jwt.validateToken(token));
        assertEquals("admin@test.com", jwt.extractEmail(token));
    }

    @Test
    void tokenExpireRejete() {
        JwtUtil jwt = new JwtUtil(SECRET, -1_000);
        assertFalse(jwt.validateToken(jwt.generateToken("a@test.com", "USER")));
    }

    @Test
    void tokenFalsifieRejete() {
        JwtUtil jwt = new JwtUtil(SECRET, 60_000);
        String token = jwt.generateToken("a@test.com", "USER");
        assertFalse(jwt.validateToken(token + "x"));
        JwtUtil autre = new JwtUtil("another-secret-another-secret-123456", 60_000);
        assertFalse(autre.validateToken(token)); // signé avec une autre clé
    }

    @Test
    void secretTropCourtRefuse() {
        assertThrows(IllegalStateException.class, () -> new JwtUtil("court", 1000));
    }
}
