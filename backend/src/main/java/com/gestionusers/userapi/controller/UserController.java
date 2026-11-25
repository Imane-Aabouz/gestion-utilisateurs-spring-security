package com.gestionusers.userapi.controller;

import com.gestionusers.userapi.model.User;
import com.gestionusers.userapi.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestionusers.userapi.dto.LoginResponse;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Tous les utilisateurs
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Utilisateurs par rôle
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(role);
    }

    // Ajouter utilisateur
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createUser(@Valid @RequestBody User user) {
        return userService.saveUser(user);
    }

    // Modifier utilisateur
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // Supprimer utilisateur
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
    // Count tout les utilisateurs
    @GetMapping("/count")
    public long countAllUsers() {
        return userService.countAllUsers();
    }
    // Count les utilisateurs par sans  role
    @GetMapping("/count/{role}")
    public long countUsersByRole(@PathVariable String role) {
        return userService.countUsersByRole(role);
    }
    @GetMapping("/search/{keyword}")
    public List<User> searchUsers(@PathVariable String keyword) {
        return userService.searchUsers(keyword);
    }
    @GetMapping("/pagination")
    public Page<User> getUsersWithPagination(
            @RequestParam int page,
            @RequestParam int size
    ) {

        return userService.getUsersWithPagination(page, size);
    }
    @GetMapping("/sort")
    public List<User> sortUsers(
            @RequestParam String field
    ) {

        return userService.sortUsers(field);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody User user) {
        LoginResponse response = userService.login(user.getEmail(), user.getPassword());
        if (response == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(response);
    }
}
