package com.fourbits.examflow.service;

import com.fourbits.examflow.model.ExamSlot;
import com.fourbits.examflow.model.ExamSlotStatus;
import com.fourbits.examflow.repository.ExamSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SchedulingService {

    @Autowired
    private ExamSlotRepository examSlotRepository;
    @Autowired
    private ExamSlotService examSlotService;

    // This is the Java port of the setInterval logic from AppContext.tsx (lines 245-263)
    @Scheduled(fixedRate = 30000) // Runs every 30 seconds
    public void updateSlotStatuses() {
        LocalDateTime now = LocalDateTime.now();

        // 1. Generate seating for PENDING slots (3 minutes before)
        LocalDateTime generationTime = now.plusMinutes(3);
        List<ExamSlot> slotsToGenerate = examSlotRepository.findByStatusAndStartTimeBefore(
                ExamSlotStatus.PENDING, 
                generationTime
        );
        for (ExamSlot slot : slotsToGenerate) {
            System.out.println("Auto-generating seating for slot: " + slot.getId());
            try {
                examSlotService.generateSeatingForSlot(slot.getId());
            } catch (Exception e) {
                System.err.println("Failed to generate seating for slot " + slot.getId() + ": " + e.getMessage());
            }
        }

        // 2. Activate GENERATED slots
        List<ExamSlot> slotsToActivate = examSlotRepository.findByStatusAndStartTimeBeforeAndEndTimeAfter(
                ExamSlotStatus.GENERATED,
                now,
                now
        );
        slotsToActivate.forEach(slot -> slot.setStatus(ExamSlotStatus.ACTIVE));
        examSlotRepository.saveAll(slotsToActivate);

        // 3. Complete ACTIVE slots
        List<ExamSlot> slotsToComplete = examSlotRepository.findByStatusAndEndTimeBefore(
                ExamSlotStatus.ACTIVE,
                now
        );
        slotsToComplete.forEach(slot -> slot.setStatus(ExamSlotStatus.COMPLETED));
        examSlotRepository.saveAll(slotsToComplete);
    }
}