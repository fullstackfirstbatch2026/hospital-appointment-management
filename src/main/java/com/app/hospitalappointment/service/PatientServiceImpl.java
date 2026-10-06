package com.app.hospitalappointment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.hospitalappointment.entity.Patient;
import com.app.hospitalappointment.repository.PatientRepository;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository repository;

    public PatientServiceImpl(PatientRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Patient> listOfPatient() {
        return repository.listOfPatient();
    }

    @Override
    public Patient findByPatientId(Long id) {
        return repository.findByPatientId(id);
    }

    @Override
    public List<Patient> findByPatientName(String name) {
        return repository.findByPatientName(name);
    }

    @Override
    public List<Patient> findByCity(String city) {
        return repository.findByCity(city);
    }
}