package com.opcalc.common.application.domain.factory;

import java.math.BigDecimal;

public class DivisionOperation implements GenericArithmeticOperation<BigDecimal, BigDecimal> {
    @Override
    public BigDecimal execute(BigDecimal operand1, BigDecimal operand2) {
        return operand1.divide(operand2);
    }
}
