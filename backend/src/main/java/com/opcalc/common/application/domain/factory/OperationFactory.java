package com.opcalc.common.application.domain.factory;

import com.opcalc.common.application.domain.model.OperationType;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class OperationFactory {
    public GenericOperation getOperation(OperationType operationType) {
        GenericOperation operation = null;

        if (Objects.requireNonNull(operationType) == OperationType.RANDOM_STRING) {
            operation = new RandomStringOperation();
        }

        return operation;
    }
}
