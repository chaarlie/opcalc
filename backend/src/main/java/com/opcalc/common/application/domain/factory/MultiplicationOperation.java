package com.opcalc.common.application.domain.factory;

import java.math.BigDecimal;

public class MultiplicationOperation implements GenericArithmeticOperation<BigDecimal, BigDecimal> {
    @Override
    public BigDecimal execute(BigDecimal operand1, BigDecimal operand2) {
        return operand1.multiply(operand2);
    }
}
