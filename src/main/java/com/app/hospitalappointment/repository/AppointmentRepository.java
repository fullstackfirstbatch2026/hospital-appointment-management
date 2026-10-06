
package com.app.hospitalappointment.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.app.hospitalappointment.entity.Appointment;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // Get all appointments
    @Query("SELECT a FROM Appointment a")
    List<Appointment> listOfAppointment();

    // Find appointment by ID
    @Query("SELECT a FROM Appointment a WHERE a.appointmentId = :id")
    Appointment findByAppointmentId(
            @Param("id") Long id);

    // Find appointments by doctor
    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId")
    List<Appointment> findByDoctorId(
            @Param("doctorId") Long doctorId);

    // Find appointments by patient
    @Query("SELECT a FROM Appointment a WHERE a.patientId = :patientId")
    List<Appointment> findByPatientId(
            @Param("patientId") Long patientId);

    // Find appointments by date
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate = :date")
    List<Appointment> findByAppointmentDate(
            @Param("date") LocalDate date);

    // JOIN - Appointment details with doctor name and patient name
    @Query(value = """
            SELECT a.appointment_id,
                   a.appointment_date,
                   a.appointment_time,
                   d.doctor_name,
                   p.patient_name
            FROM appointment a
            JOIN doctor d
            ON a.doctor_id = d.doctor_id
            JOIN patient p
            ON a.patient_id = p.patient_id
            """, nativeQuery = true)
    List<Object[]> getAppointmentDetails();
}
