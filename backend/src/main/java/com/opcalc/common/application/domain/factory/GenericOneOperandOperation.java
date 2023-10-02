package com.opcalc.common.application.domain.factory;

public interface GenericOneOperandOperation<K> {
    default <T> T execute(K operand1) {
        return null;
    }
}
