package com.opcalc.common.application.domain.factory;

import com.opcalc.common.application.domain.model.OperationType;
import org.springframework.stereotype.Component;

@Component
public class ArithmeticOperationFactory {
    public GenericArithmeticOperation getOperation(OperationType operationType) {
        GenericArithmeticOperation operation = null;

        switch (operationType) {
            case SUBTRACTION -> operation = new SubtractionOperation();
            case DIVISION -> operation = new DivisionOperation();
            case MULTIPLICATION -> operation = new MultiplicationOperation();
            case ADDITION -> operation = new AdditionOperation();
        }

        return operation;
    }
}
