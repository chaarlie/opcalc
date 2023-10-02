package com.opcalc.common.application.port.input;

public interface DeleteRecordUseCase {
    Long deleteOne(DeleteRecordByIdCommand deleteRecordByIdCommand);
}
