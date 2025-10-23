package com.fourbits.examflow.model;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "hall")
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private int capacity; // Number of benches

    @Column(nullable = false)
    private String block;

    @Column(nullable = false)
    private int columns; // 2, 3, or 4

    @ManyToMany(mappedBy = "halls")
    @JsonIgnore // Prevents infinite loops
    private Set<ExamSlot> examSlots;

    // Getters and Setters...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getBlock() { return block; }
    public void setBlock(String block) { this.block = block; }
    public int getColumns() { return columns; }
    public void setColumns(int columns) { this.columns = columns; }
    public Set<ExamSlot> getExamSlots() { return examSlots; }
    public void setExamSlots(Set<ExamSlot> examSlots) { this.examSlots = examSlots; }
}