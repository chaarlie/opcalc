package com.opcalc.common.adapter.out.persistence;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface OperationRepository extends CrudRepository<OperationEntity,Long> {
    @Override
    List<OperationEntity> findAll();
}
