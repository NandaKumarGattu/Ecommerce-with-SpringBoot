package com.ecommerce.repository;

import com.ecommerce.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Custom method to find category by name
    Optional<Category> findByName(String name);
    
    // Optional: Case-insensitive search
    Optional<Category> findByNameIgnoreCase(String name);
    
    // Optional: Check if category exists by name
    boolean existsByName(String name);
}