package com.fourbits.examflow.service;

import com.fourbits.examflow.dto.ExamSlotDTO;
import com.fourbits.examflow.dto.SlotCreationRequest;
import com.fourbits.examflow.model.*;
import com.fourbits.examflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamSlotService {

    @Autowired
    private ExamSlotRepository examSlotRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private HallRepository hallRepository;
    @Autowired
    private ClassGroupRepository classGroupRepository;
    @Autowired
    private SeatingRepository seatingRepository;

    public List<ExamSlotDTO> getAllExamSlots() {
        return examSlotRepository.findAll().stream()
                .map(slot -> new ExamSlotDTO(slot.getId(), slot.getName(), slot.getStartTime(), slot.getStatus()))
                .collect(Collectors.toList());
    }

    public ExamSlot getExamSlotById(Long id) {
        return examSlotRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ExamSlot not found"));
    }
    
    // Replaces addExamSlot from AppContext.tsx
    @Transactional
    public ExamSlot createExamSlot(SlotCreationRequest request) {
        ExamSlot slot = new ExamSlot();
        slot.setName(request.getName());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setStatus(ExamSlotStatus.PENDING);

        Set<ClassGroup> classGroups = new HashSet<>(classGroupRepository.findAllById(request.getClassGroupIds()));
        Set<Hall> halls = new HashSet<>(hallRepository.findAllById(request.getHallIds()));

        if (classGroups.size() != request.getClassGroupIds().size()) {
            throw new EntityNotFoundException("One or more ClassGroups not found");
        }
        if (halls.size() != request.getHallIds().size()) {
            throw new EntityNotFoundException("One or more Halls not found");
        }

        slot.setClassGroups(classGroups);
        slot.setHalls(halls);

        return examSlotRepository.save(slot);
    }
    
    public void deleteExamSlot(Long id) {
        // Seating entries will be deleted automatically due to `cascade = CascadeType.ALL`
        examSlotRepository.deleteById(id);
    }

    /**
     * This is the Java port of the generateSeatingForSlot algorithm
     * from AppContext.tsx (lines 142-243).
     */
    @Transactional
    public void generateSeatingForSlot(Long slotId) {
        ExamSlot slot = getExamSlotById(slotId);
        if (slot.getStatus() != ExamSlotStatus.PENDING) {
            System.out.println("Seating already generated or slot is not pending.");
            return;
        }

        List<Long> classGroupIds = slot.getClassGroups().stream().map(ClassGroup::getId).collect(Collectors.toList());
        List<Student> studentsToArrange = studentRepository.findByClassGroupIdIn(classGroupIds);
        
        List<Hall> hallsToUse = new ArrayList<>(slot.getHalls());
        hallsToUse.sort(Comparator.comparing(Hall::getBlock).thenComparing(Hall::getName));

        // 1. Shuffle students within each department
        Map<Long, List<Student>> studentsByDept = studentsToArrange.stream()
                .collect(Collectors.groupingBy(s -> s.getClassGroup().getId()));
        
        studentsByDept.values().forEach(Collections::shuffle);

        // 2. Interleave students
        List<Student> interleavedStudents = new ArrayList<>();
        int maxDeptSize = studentsByDept.values().stream().mapToInt(List::size).max().orElse(0);
        for (int i = 0; i < maxDeptSize; i++) {
            for (List<Student> deptStudents : studentsByDept.values()) {
                if (i < deptStudents.size()) {
                    interleavedStudents.add(deptStudents.get(i));
                }
            }
        }

        List<Seating> seatingPlan = new ArrayList<>();
        int totalBenches = hallsToUse.stream().mapToInt(Hall::getCapacity).sum();
        int totalStudents = interleavedStudents.size();
        
        if (totalStudents == 0) {
             slot.setStatus(ExamSlotStatus.GENERATED);
             examSlotRepository.save(slot);
             return;
        }

        boolean isSparseSeating = totalBenches >= totalStudents * 2;
        Iterator<Student> studentIterator = interleavedStudents.iterator();

        if (isSparseSeating) {
            // Porting sparse seating logic (lines 188-219)
            System.out.println("Using sparse seating logic.");
            for (Hall hall : hallsToUse) {
                double proportion = (double) hall.getCapacity() / totalBenches;
                int studentsForHall = (int) Math.floor(proportion * totalStudents);
                
                for (int i = 0; i < studentsForHall && studentIterator.hasNext(); i++) {
                    Student student = studentIterator.next();
                    int benchNum = (int) Math.floor(i * ((double) hall.getCapacity() / studentsForHall)) + 1;
                    String seatNumber = getSeatNumber(benchNum, hall.getColumns(), 1); // "A1-1", "B1-1", etc.
                    seatingPlan.add(createSeating(student, hall, slot, seatNumber));
                }
            }
            // Distribute remaining students
            int hallIdx = 0;
            while (studentIterator.hasNext()) {
                // This is a simplified distribution for remaining students
                Hall hall = hallsToUse.get(hallIdx % hallsToUse.size());
                // In a real app, you'd find the next available "sparse" seat
                // For now, we'll just add them. This logic should be refined.
                Student student = studentIterator.next();
                String seatNumber = "EXTRA-" + (hallIdx + 1); // Placeholder
                seatingPlan.add(createSeating(student, hall, slot, seatNumber));
                hallIdx++;
            }

        } else {
            // Porting dense seating logic (lines 221-238)
            System.out.println("Using dense seating logic.");
            boolean useDoubleSeating = totalStudents > totalBenches;
            if (totalStudents > totalBenches * 2) {
                System.err.println("Not enough capacity even with double seating!");
                // Don't change status, let it fail to be noticed
                return;
            }

            for (Hall hall : hallsToUse) {
                for (int benchNum = 1; benchNum <= hall.getCapacity(); benchNum++) {
                    if (studentIterator.hasNext()) {
                        Student student1 = studentIterator.next();
                        String seat1 = getSeatNumber(benchNum, hall.getColumns(), 1);
                        seatingPlan.add(createSeating(student1, hall, slot, seat1));
                    }
                    if (useDoubleSeating && studentIterator.hasNext()) {
                        Student student2 = studentIterator.next();
                        String seat2 = getSeatNumber(benchNum, hall.getColumns(), 2);
                        seatingPlan.add(createSeating(student2, hall, slot, seat2));
                    }
                }
            }
        }
        
        seatingRepository.saveAll(seatingPlan);
        slot.setStatus(ExamSlotStatus.GENERATED);
        examSlotRepository.save(slot);
        System.out.println("Generated seating for slot " + slotId);
    }

    // Helper to create Seating entity
    private Seating createSeating(Student s, Hall h, ExamSlot es, String seatNum) {
        Seating seating = new Seating();
        seating.setStudent(s);
        seating.setHall(h);
        seating.setExamSlot(es);
        seating.setSeatNumber(seatNum);
        return seating;
    }

    // Helper to generate seat number (e.g., A1-1, B1-2)
    private String getSeatNumber(int benchNum, int columns, int seatPos) {
        String col = String.valueOf((char) ('A' + ((benchNum - 1) % columns)));
        int row = (int) Math.floor((benchNum - 1) / columns) + 1;
        return col + row + "-" + seatPos;
    }
}