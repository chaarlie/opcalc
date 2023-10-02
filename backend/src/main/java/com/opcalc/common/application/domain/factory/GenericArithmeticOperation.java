package com.opcalc.common.application.domain.factory;

public interface GenericArithmeticOperation<K, L> {
    <T> T execute(K operand1, L operand2);
}
