package com.gestionusers.userapi.dto;

public record LoginResponse(String token, String name, String email, String role) {}
