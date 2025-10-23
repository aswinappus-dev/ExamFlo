package com.fourbits.examflow.repository;

import com.fourbits.examflow.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // This lets you find a student by their register number
    // (Used in StudentFinder.tsx)
    Optional<Student> findByRegisterNumber(String registerNumber);

    // This lets you find all students belonging to a list of class groups
    // (Used in the seating generation logic)
    List<Student> findByClassGroupIdIn(List<Long> classGroupIds);
}