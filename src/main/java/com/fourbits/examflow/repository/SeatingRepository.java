package com.fourbits.examflow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fourbits.examflow.model.Seating;

@Repository
public interface SeatingRepository extends JpaRepository<Seating, Long> {

    // Finds a specific student's seat in a specific exam
    // (Used in findStudentSeat and updateStudentAttendance)
    Optional<Seating> findByExamSlotIdAndStudentId(Long examSlotId, Long studentId);
}