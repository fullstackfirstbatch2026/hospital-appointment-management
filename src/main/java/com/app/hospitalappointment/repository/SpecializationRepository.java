package com.app.hospitalappointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.hospitalappointment.entity.Specialization;

public interface SpecializationRepository
        extends JpaRepository<Specialization, Long> {

    // Get all specializations
    @Query("SELECT s FROM Specialization s")
    List<Specialization> listOfSpecialization();

    // Find specialization by ID
    @Query("SELECT s FROM Specialization s WHERE s.specializationId = :id")
    Specialization findBySpecializationId(
            @Param("id") Long id);

    // Find specialization by name
    @Query("SELECT s FROM Specialization s WHERE s.specializationName = :name")
    Specialization findBySpecializationName(
            @Param("name") String name);
}