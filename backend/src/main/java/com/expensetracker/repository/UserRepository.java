package com.expensetracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.expensetracker.entity.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    Optional<User> findByEmail(String email);
}
