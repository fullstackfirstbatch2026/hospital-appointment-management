package com.app.hospitalappointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.hospitalappointment.entity.Patient;

public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    // Get all patients
    @Query("SELECT p FROM Patient p")
    List<Patient> listOfPatient();

    // Find patient by ID
    @Query("SELECT p FROM Patient p WHERE p.patientId = :id")
    Patient findByPatientId(
            @Param("id") Long id);

    // Find patients by name
    @Query("SELECT p FROM Patient p WHERE p.patientName = :name")
    List<Patient> findByPatientName(
            @Param("name") String name);

    // Find patients by city
    @Query("SELECT p FROM Patient p WHERE p.city = :city")
    List<Patient> findByCity(
            @Param("city") String city);
}