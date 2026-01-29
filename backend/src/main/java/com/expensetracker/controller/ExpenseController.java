package com.expensetracker.controller;

import com.expensetracker.entity.Expense;
import com.expensetracker.entity.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseRepository expenseRepository,
                             UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    // ADD expense (JWT required)
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense, Authentication authentication) {
        String name = authentication.getName(); // Get username from JWT token
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    // GET logged-in user's expenses
    @GetMapping
    public List<Expense> getMyExpenses(Authentication authentication) {
        String name = authentication.getName();
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return expenseRepository.findByUser(user);
    }

    // DELETE expense (only own)
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id, Authentication authentication) {
        String name = authentication.getName();
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        expenseRepository.deleteById(id);
    }

    // UPDATE expense (only own)
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id,
                                @RequestBody Expense updated,
                                Authentication authentication) {
        String name = authentication.getName();
        User user = userRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        expense.setTitle(updated.getTitle());
        expense.setAmount(updated.getAmount());
        expense.setCategory(updated.getCategory());
        expense.setDate(updated.getDate());
        
        return expenseRepository.save(expense);
    }
}
