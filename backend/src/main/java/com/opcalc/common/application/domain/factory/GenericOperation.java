package com.opcalc.common.application.domain.factory;

public interface GenericOperation {
    <T> T execute();
}
