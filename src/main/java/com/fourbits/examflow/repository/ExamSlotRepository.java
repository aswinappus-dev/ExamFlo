package com.fourbits.examflow.repository;

import com.fourbits.examflow.model.ExamSlot;
import com.fourbits.examflow.model.ExamSlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExamSlotRepository extends JpaRepository<ExamSlot, Long> {

    // Finds slots that are not PENDING and have not been COMPLETED
    // (Used in getPublicSlotDetails)
    Optional<ExamSlot> findFirstByStatusInAndEndTimeAfterOrderByStartTimeAsc(
        List<ExamSlotStatus> statuses, 
        LocalDateTime now
    );

    // Finds PENDING slots that need seating generated
    // (Used by SchedulingService)
    List<ExamSlot> findByStatusAndStartTimeBefore(ExamSlotStatus status, LocalDateTime now);

    // Finds GENERATED slots that need to become ACTIVE
    // (Used by SchedulingService)
    List<ExamSlot> findByStatusAndStartTimeBeforeAndEndTimeAfter(
        ExamSlotStatus status, 
        LocalDateTime startTime, 
        LocalDateTime endTime
    );

    // Finds ACTIVE slots that need to be COMPLETED
    // (Used by SchedulingService)
    List<ExamSlot> findByStatusAndEndTimeBefore(ExamSlotStatus status, LocalDateTime now);
}