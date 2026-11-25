package com.gestionusers.userapi.repository;

import com.gestionusers.userapi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByRole(String role);
    long count();
    long countByRole(String role);
    List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name,
            String email
    );
    User findByEmail(String email);

}