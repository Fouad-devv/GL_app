package com.gmpp.maintenance.repository;

import com.gmpp.maintenance.entity.User;
import com.gmpp.maintenance.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    List<User> findByRole(UserRole role);

    List<User> findByActiveTrue();

    List<User> findByActiveTrueAndRole(UserRole role);

    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:search% OR u.email LIKE %:search%")
    List<User> searchUsers(@Param("search") String search);

    List<User> findByActiveOrderByFullNameAsc(Boolean active);

    Long countByRole(UserRole role);

    Long countByActiveTrue();
}
