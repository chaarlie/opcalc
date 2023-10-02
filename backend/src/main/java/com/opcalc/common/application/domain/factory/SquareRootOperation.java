package com.opcalc.common.application.domain.factory;

import java.math.BigDecimal;
import java.math.MathContext;

public class SquareRootOperation implements GenericOneOperandOperation<BigDecimal> {
    @Override
    public BigDecimal execute(BigDecimal operand) {
        MathContext mc = new MathContext(10);
        return operand.sqrt(mc);
    }
}
