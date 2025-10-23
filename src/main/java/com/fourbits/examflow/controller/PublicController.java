package com.fourbits.examflow.controller;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import Hall

import com.fourbits.examflow.dto.AttendanceRequestDTO;
import com.fourbits.examflow.dto.PublicSlotDetailsDTO; // Import Student
import com.fourbits.examflow.dto.StudentSeatDetailsDTO;
import com.fourbits.examflow.model.ExamSlot;
import com.fourbits.examflow.model.ExamSlotStatus;
import com.fourbits.examflow.model.Hall;
import com.fourbits.examflow.model.Seating;
import com.fourbits.examflow.model.Student; // Import Transactional
import com.fourbits.examflow.repository.ExamSlotRepository;
import com.fourbits.examflow.repository.SeatingRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PublicController {

    @Autowired
    private ExamSlotRepository examSlotRepository;
    @Autowired
    private SeatingRepository seatingRepository;

    /**
     * Gets details about the current active or upcoming exam slot.
     * Ported from getPublicSlotDetails in AppContext.tsx.
     * @return DTO containing the slot status, ID, and reveal time.
     */
    public PublicSlotDetailsDTO getPublicSlotDetails() {
        LocalDateTime now = LocalDateTime.now();

        // Find the earliest slot that is GENERATED or ACTIVE and ends after the current time.
        Optional<ExamSlot> activeOrUpcomingSlotOpt = examSlotRepository.findFirstByStatusInAndEndTimeAfterOrderByStartTimeAsc(
                Arrays.asList(ExamSlotStatus.GENERATED, ExamSlotStatus.ACTIVE),
                now
        );

        if (activeOrUpcomingSlotOpt.isEmpty()) {
            // No active or upcoming slots found
            return new PublicSlotDetailsDTO("NONE", null, null);
        }

        ExamSlot slot = activeOrUpcomingSlotOpt.get();
        // Reveal time is 2 minutes before the official start time
        LocalDateTime revealTime = slot.getStartTime().minusMinutes(2);

        if (now.isBefore(revealTime)) {
            // Exam is scheduled but reveal time hasn't passed yet
            return new PublicSlotDetailsDTO("UPCOMING", slot.getId(), revealTime);
        } else {
            // Reveal time has passed, the slot is considered "ACTIVE" for public view
            // (even if its actual status is GENERATED but start time hasn't passed)
            return new PublicSlotDetailsDTO("ACTIVE", slot.getId(), null);
        }
    }

    /**
     * Finds the seating details for a specific student in a given exam slot.
     * Ported from findStudentSeat in AppContext.tsx.
     *
     * @param slotId The ID of the exam slot.
     * @param studentId The ID of the student (Found by the controller using registerNumber). <--- CORRECTED PARAMETER TYPE
     * @return DTO containing student name, register number, hall details, and seat number.
     * @throws EntityNotFoundException if the student's seat is not found in the specified slot.
     */
    @Transactional(readOnly = true) // Use read-only transaction for fetching data
    public StudentSeatDetailsDTO findStudentSeat(Long slotId, Long studentId) { // <--- CORRECTED SIGNATURE (Long, Long)

        // Find the specific seating entry using both slotId and studentId
        Seating seating = seatingRepository.findByExamSlotIdAndStudentId(slotId, studentId)
                .orElseThrow(() -> new EntityNotFoundException("Seat not found for the given student in this exam slot."));

        // Eagerly fetch associated entities within the transaction
        Student student = seating.getStudent();
        Hall hall = seating.getHall();

        // Create and return the DTO
        return new StudentSeatDetailsDTO(
                student.getName(),
                student.getRegisterNumber(),
                hall.getName(),
                hall.getBlock(),
                seating.getSeatNumber()
        );
    }

    /**
     * Updates the attendance status for a student in a specific exam slot.
     * Ported from updateStudentAttendance in AppContext.tsx.
     * Used by the InvigilatorDashboard.
     *
     * @param request DTO containing slotId, studentId, and the new AttendanceStatus.
     * @throws EntityNotFoundException if the seating entry doesn't exist.
     */
    @Transactional // Use a transaction as we are modifying data
    public void updateStudentAttendance(AttendanceRequestDTO request) {
        // Find the specific seating entry
        Seating seating = seatingRepository.findByExamSlotIdAndStudentId(request.getSlotId(), request.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Seating record not found for student " + request.getStudentId() + " in slot " + request.getSlotId()));

        // Update the attendance status
        seating.setAttendance(request.getStatus());

        // Save the updated seating record
        seatingRepository.save(seating);
    }
}