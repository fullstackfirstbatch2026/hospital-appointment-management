
package com.app.hospitalappointment.service;

import java.time.LocalDate;
import java.util.List;

import com.app.hospitalappointment.entity.Appointment;

public interface AppointmentService {

    List<Appointment> listOfAppointment();

    Appointment findByAppointmentId(Long id);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByAppointmentDate(LocalDate date);

    // JOIN - Appointment details with doctor name and patient name
    List<Object[]> getAppointmentDetails();
}
