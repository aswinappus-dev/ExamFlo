package com.fourbits.examflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fourbits.examflow.model.ClassGroup;

@Repository
public interface ClassGroupRepository extends JpaRepository<ClassGroup, Long> {
    // Basic CRUD operations are all we need for this
}