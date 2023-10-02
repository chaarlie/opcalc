package com.opcalc.common.application.port.input;

public interface CreateUserAccountUseCase {
    long createOne(CreateOneUserAccountCommand createOneCommand);
}
