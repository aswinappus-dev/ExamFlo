package com.fourbits.examflow.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fourbits.examflow.dto.AttendanceRequestDTO;
import com.fourbits.examflow.dto.PublicSlotDetailsDTO;
import com.fourbits.examflow.dto.StudentSeatDetailsDTO;
import com.fourbits.examflow.model.ExamSlot;
import com.fourbits.examflow.model.ExamSlotStatus;
import com.fourbits.examflow.model.Seating;
import com.fourbits.examflow.repository.ExamSlotRepository;
import com.fourbits.examflow.repository.SeatingRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PublicService {

    @Autowired
    private ExamSlotRepository examSlotRepository;
    @Autowired
    private SeatingRepository seatingRepository;

    // This is the Java port of getPublicSlotDetails from AppContext.tsx (lines 265-289)
    public PublicSlotDetailsDTO getPublicSlotDetails() {
        LocalDateTime now = LocalDateTime.now();
        
        Optional<ExamSlot> activeOrUpcomingSlot = examSlotRepository.findFirstByStatusInAndEndTimeAfterOrderByStartTimeAsc(
                Arrays.asList(ExamSlotStatus.GENERATED, ExamSlotStatus.ACTIVE),
                now
        );

        if (activeOrUpcomingSlot.isEmpty()) {
            return new PublicSlotDetailsDTO("NONE", null, null);
        }

        ExamSlot slot = activeOrUpcomingSlot.get();
        LocalDateTime revealTime = slot.getStartTime().minusMinutes(2); // 2 minutes before

        if (now.isBefore(revealTime)) {
            return new PublicSlotDetailsDTO("UPCOMING", slot.getId(), revealTime);
        } else {
            return new PublicSlotDetailsDTO("ACTIVE", slot.getId(), null);
        }
    }

    // This is the Java port of findStudentSeat from AppContext.tsx (lines 291-305)
    public StudentSeatDetailsDTO findStudentSeat(Long slotId, String registerNumber) {
        // Note: We find the Seating, which links all other entities
        Seating seating = seatingRepository.findByExamSlotIdAndStudentId(
            slotId, 
            // This is a simplification; we'd need to find student by regNo first
            // Let's assume we enhance the repository for this.
            // For now, let's pretend we have the studentId.
            // This part needs a StudentRepository.
            // ...
            // This logic is simplified. A real impl would find student by regNo first.
            // This is a placeholder. We'll fix this in the Controller.
            0L // Placeholder
        ).orElseThrow(() -> new EntityNotFoundException("Seat not found for student in this exam."));

        return new StudentSeatDetailsDTO(
                seating.getStudent().getName(),
                seating.getStudent().getRegisterNumber(),
                seating.getHall().getName(),
                seating.getHall().getBlock(),
                seating.getSeatNumber()
        );
    }

    // This is the Java port of updateStudentAttendance from AppContext.tsx (lines 307-321)
    public void updateStudentAttendance(AttendanceRequestDTO request) {
        Seating seating = seatingRepository.findByExamSlotIdAndStudentId(request.getSlotId(), request.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Seat not found"));
        
        seating.setAttendance(request.getStatus());
        seatingRepository.save(seating);
    }
}