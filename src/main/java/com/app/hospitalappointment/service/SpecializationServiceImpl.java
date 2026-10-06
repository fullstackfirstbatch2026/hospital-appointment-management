package com.app.hospitalappointment.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.app.hospitalappointment.entity.Specialization;
import com.app.hospitalappointment.repository.SpecializationRepository;

@Service
public class SpecializationServiceImpl
        implements SpecializationService {

    private final SpecializationRepository repository;

    public SpecializationServiceImpl(
            SpecializationRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Specialization> listOfSpecialization() {
        return repository.listOfSpecialization();
    }

    @Override
    public Specialization findBySpecializationId(Long id) {
        return repository.findBySpecializationId(id);
    }

    @Override
    public Specialization findBySpecializationName(String name) {
        return repository.findBySpecializationName(name);
    }
}