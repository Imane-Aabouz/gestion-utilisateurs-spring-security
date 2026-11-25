package com.gestionusers.userapi.service;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.gestionusers.userapi.dto.LoginResponse;
import com.gestionusers.userapi.model.User;
import com.gestionusers.userapi.repository.UserRepository;
import com.gestionusers.userapi.security.JwtUtil;
import com.gestionusers.userapi.security.LoginAttemptService;

@Service
public class UserService implements UserDetailsService {

    // champs autorisés pour le tri (évite de laisser le client choisir n'importe quelle propriété)
    private static final Set<String> SORTABLE_FIELDS = Set.of("id", "name", "email", "role");
    private static final Set<String> ROLES = Set.of("ADMIN", "USER");
    private static final int MAX_PAGE_SIZE = 100;

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LoginAttemptService loginAttempts;

    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       LoginAttemptService loginAttempts) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.loginAttempts = loginAttempts;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public User saveUser(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");
        }
        user.setId(null); // jamais d'id imposé par le client
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable");
        }
        userRepository.deleteById(id);
    }

    public long countAllUsers() {
        return userRepository.count();
    }

    public long countUsersByRole(String role) {
        return userRepository.countByRole(role);
    }

    public User updateUser(Long id, User updated) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        if (hasText(updated.getName())) {
            user.setName(updated.getName().trim());
        }

        if (hasText(updated.getEmail())) {
            String email = updated.getEmail().trim();
            User other = userRepository.findByEmail(email);
            if (other != null && !other.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email déjà utilisé");
            }
            user.setEmail(email);
        }

        if (hasText(updated.getPassword())) {
            int len = updated.getPassword().length();
            if (len < 8 || len > 72) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Le mot de passe doit contenir entre 8 et 72 caractères");
            }
            user.setPassword(passwordEncoder.encode(updated.getPassword()));
        }

        if (hasText(updated.getRole())) {
            if (!ROLES.contains(updated.getRole())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rôle invalide");
            }
            user.setRole(updated.getRole());
        }

        return userRepository.save(user);
    }

    public List<User> searchUsers(String keyword) {
        return userRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword);
    }

    public Page<User> getUsersWithPagination(int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        return userRepository.findAll(PageRequest.of(safePage, safeSize));
    }

    public List<User> sortUsers(String field) {
        if (!SORTABLE_FIELDS.contains(field)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Champ de tri invalide");
        }
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, field));
    }

    /** @return la réponse de connexion, ou null si les identifiants sont invalides */
    public LoginResponse login(String email, String password) {
        if (loginAttempts.isBlocked(email)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                    "Trop de tentatives, réessayez plus tard");
        }

        User user = (email == null) ? null : userRepository.findByEmail(email);

        if (user != null && password != null
                && passwordEncoder.matches(password, user.getPassword())) {
            loginAttempts.recordSuccess(email);
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
            return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole());
        }

        loginAttempts.recordFailure(email);
        return null;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) throw new UsernameNotFoundException("User not found");

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())
                .build();
    }

    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }
}
