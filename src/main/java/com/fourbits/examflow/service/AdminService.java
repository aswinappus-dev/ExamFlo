package com.fourbits.examflow.service;

import com.fourbits.examflow.dto.StudentDTO;
import com.fourbits.examflow.model.ClassGroup;
import com.fourbits.examflow.model.Hall;
import com.fourbits.examflow.model.Student;
import com.fourbits.examflow.repository.ClassGroupRepository;
import com.fourbits.examflow.repository.HallRepository;
import com.fourbits.examflow.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private HallRepository hallRepository;
    @Autowired
    private ClassGroupRepository classGroupRepository;

    // --- Student Methods ---
    // (Replaces addStudent, updateStudent, deleteStudent from AppContext.tsx)

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::convertStudentToDTO)
                .collect(Collectors.toList());
    }

    public Student createStudent(StudentDTO studentDTO) {
        Student student = new Student();
        student.setRegisterNumber(studentDTO.getRegisterNumber());
        student.setName(studentDTO.getName());
        ClassGroup cg = classGroupRepository.findById(studentDTO.getClassGroupId())
                .orElseThrow(() -> new EntityNotFoundException("ClassGroup not found"));
        student.setClassGroup(cg);
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, StudentDTO studentDTO) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));
        student.setRegisterNumber(studentDTO.getRegisterNumber());
        student.setName(studentDTO.getName());
        ClassGroup cg = classGroupRepository.findById(studentDTO.getClassGroupId())
                .orElseThrow(() -> new EntityNotFoundException("ClassGroup not found"));
        student.setClassGroup(cg);
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    private StudentDTO convertStudentToDTO(Student student) {
        return new StudentDTO(
                student.getId(),
                student.getRegisterNumber(),
                student.getName(),
                student.getClassGroup().getId(),
                student.getClassGroup().getName()
        );
    }

    // --- Hall Methods ---
    // (Replaces addHall, updateHall, deleteHall from AppContext.tsx)

    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    public Hall saveHall(Hall hall) {
        // Can be used for both create and update
        return hallRepository.save(hall);
    }

    public void deleteHall(Long id) {
        hallRepository.deleteById(id);
    }
    
    // --- ClassGroup Methods ---

    public List<ClassGroup> getAllClassGroups() {
        return classGroupRepository.findAll();
    }
}