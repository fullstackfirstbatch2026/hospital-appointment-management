package com.app.hospitalappointment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.hospitalappointment.entity.Doctor;
import com.app.hospitalappointment.repository.DoctorRepository;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository repository;

    public DoctorServiceImpl(DoctorRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Doctor> listOfDoctor() {
        return repository.listOfDoctor();
    }

    @Override
    public Doctor findByDoctorId(Long id) {
        return repository.findByDoctorId(id);
    }

    @Override
    public List<Doctor> findByDoctorName(String name) {
        return repository.findByDoctorName(name);
    }

    @Override
    public List<Doctor> findBySpecialization(Long specializationId) {
        return repository.findBySpecialization(specializationId);
    }

    @Override
    public List<Object[]> findDoctorsAboveAverageAppointments() {
        return repository.findDoctorsAboveAverageAppointments();
    }
}