package com.app.hospitalappointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.hospitalappointment.entity.Doctor;

public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {

    // Get all doctors
    @Query("SELECT d FROM Doctor d")
    List<Doctor> listOfDoctor();

    // Find doctor by ID
    @Query("SELECT d FROM Doctor d WHERE d.doctorId = :id")
    Doctor findByDoctorId(
            @Param("id") Long id);

    // Find doctors by name
    @Query("SELECT d FROM Doctor d WHERE d.doctorName = :name")
    List<Doctor> findByDoctorName(
            @Param("name") String name);

    // Find doctors by specialization
    @Query("""
           SELECT d
           FROM Doctor d
           WHERE d.specializationId = :specializationId
           """)
    List<Doctor> findBySpecialization(
            @Param("specializationId") Long specializationId);

    // Doctors having more appointments than average doctor
    @Query(value = """
           SELECT d.doctor_id,
                  d.doctor_name,
                  COUNT(a.appointment_id) AS appointment_count
           FROM doctor d
           JOIN appointment a
           ON d.doctor_id = a.doctor_id
           GROUP BY d.doctor_id, d.doctor_name
           HAVING COUNT(a.appointment_id) >
                  (
                      SELECT AVG(appointment_count)
                      FROM
                      (
                          SELECT COUNT(*) AS appointment_count
                          FROM appointment
                          GROUP BY doctor_id
                      )
                  )
           """, nativeQuery = true)
    List<Object[]> findDoctorsAboveAverageAppointments();

}