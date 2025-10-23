package com.fourbits.examflow.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fourbits.examflow.dto.ExamSlotDTO;
import com.fourbits.examflow.dto.SlotCreationRequest;
import com.fourbits.examflow.dto.StudentDTO;
import com.fourbits.examflow.model.ClassGroup;
import com.fourbits.examflow.model.ExamSlot;
import com.fourbits.examflow.model.Hall;
import com.fourbits.examflow.repository.ExamSlotRepository;
import com.fourbits.examflow.repository.HallRepository;
import com.fourbits.examflow.repository.StudentRepository;
import com.fourbits.examflow.service.AdminService;
import com.fourbits.examflow.service.ExamSlotService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private HallRepository hallRepository;
    @Autowired
    private AdminService adminService;
    @Autowired
    private ExamSlotService examSlotService;
    @Autowired
    private ExamSlotRepository examSlotRepository;

    @GetMapping("/dashboard-stats")
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("studentCount", studentRepository.count());
        stats.put("hallCount", hallRepository.count());
        stats.put("slotCount", examSlotRepository.count());
        return stats;
    }

    // --- Student Endpoints (for ManageStudents.tsx) ---
    @GetMapping("/students")
    public List<StudentDTO> getAllStudents() {
        return adminService.getAllStudents();
    }

    @PostMapping("/students")
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(adminService.createStudent(studentDTO));
    }
    
    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO studentDTO) {
        return ResponseEntity.ok(adminService.updateStudent(id, studentDTO));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        adminService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }
    
    // --- Hall Endpoints (for ManageHalls.tsx) ---
    @GetMapping("/halls")
    public List<Hall> getAllHalls() {
        return adminService.getAllHalls();
    }
    
    @PostMapping("/halls")
    public Hall saveHall(@Valid @RequestBody Hall hall) {
        // Handles both create and update
        return adminService.saveHall(hall);
    }
    
    @DeleteMapping("/halls/{id}")
    public ResponseEntity<?> deleteHall(@PathVariable Long id) {
        adminService.deleteHall(id);
        return ResponseEntity.ok().build();
    }
    
    // --- ClassGroup Endpoints (for StudentForm.tsx dropdown) ---
    @GetMapping("/class-groups")
    public List<ClassGroup> getAllClassGroups() {
        return adminService.getAllClassGroups();
    }

    // --- ExamSlot Endpoints (for ManageSlots.tsx) ---
    @GetMapping("/slots")
    public List<ExamSlotDTO> getAllSlots() {
        return examSlotService.getAllExamSlots();
    }
    
    @GetMapping("/slots/{id}")
    public ExamSlot getSlotById(@PathVariable Long id) {
        // This will be a simplified DTO in a real app
        return examSlotService.getExamSlotById(id);
    }
    
    @PostMapping("/slots")
    public ExamSlot createSlot(@Valid @RequestBody SlotCreationRequest request) {
        return examSlotService.createExamSlot(request);
    }
    
    @DeleteMapping("/slots/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id) {
        examSlotService.deleteExamSlot(id);
        return ResponseEntity.ok().build();
    }
}