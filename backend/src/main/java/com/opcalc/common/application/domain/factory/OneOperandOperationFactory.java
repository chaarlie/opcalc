package com.opcalc.common.application.domain.factory;

import com.opcalc.common.application.domain.model.OperationType;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class OneOperandOperationFactory {

    public GenericOneOperandOperation getOperation(OperationType operationType) {
        GenericOneOperandOperation operation = null;

        if (Objects.requireNonNull(operationType) == OperationType.SQUARE_ROOT) {
            operation = new SquareRootOperation();
        }

        return operation;
    }
}
