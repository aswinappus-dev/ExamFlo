package com.fourbits.examflow.repository;

import com.fourbits.examflow.model.Hall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HallRepository extends JpaRepository<Hall, Long> {
    
    // This lets you find all halls from a list of IDs
    // (Used in the seating generation logic)
    List<Hall> findByIdIn(List<Long> hallIds);
}