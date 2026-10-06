
package com.app.hospitalappointment.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.app.hospitalappointment.entity.Appointment;
import com.app.hospitalappointment.repository.AppointmentRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;

    public AppointmentServiceImpl(
            AppointmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Appointment> listOfAppointment() {
        return repository.listOfAppointment();
    }

    @Override
    public Appointment findByAppointmentId(Long id) {
        return repository.findByAppointmentId(id);
    }

    @Override
    public List<Appointment> findByDoctorId(Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    @Override
    public List<Appointment> findByPatientId(Long patientId) {
        return repository.findByPatientId(patientId);
    }

    @Override
    public List<Appointment> findByAppointmentDate(
            LocalDate date) {
        return repository.findByAppointmentDate(date);
    }

    // JOIN - Appointment details with doctor name and patient name
    @Override
    public List<Object[]> getAppointmentDetails() {
        return repository.getAppointmentDetails();
    }
}
