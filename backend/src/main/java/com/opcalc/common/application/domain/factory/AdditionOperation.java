package com.opcalc.common.application.domain.factory;

import java.math.BigDecimal;

public class AdditionOperation implements GenericArithmeticOperation<BigDecimal, BigDecimal> {
    @Override
    public BigDecimal execute(BigDecimal operand1, BigDecimal operand2) {
        return operand1.add(operand2);
    }
}
