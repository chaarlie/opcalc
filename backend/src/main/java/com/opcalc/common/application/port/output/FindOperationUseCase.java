package com.opcalc.common.application.port.output;

import com.opcalc.common.application.domain.model.Operation;

import java.util.List;

public interface FindOperationUseCase {
    Operation findById(FindOperationByIdCommand findOperationByIdCommand);

    List<Operation> findAll();
}
