package com.opcalc.common.application.port.input;

import com.opcalc.common.application.domain.dto.OperationInputDto;
import com.opcalc.common.application.domain.model.UserAccount;

public record PerformOperationCommand(OperationInputDto operationInputDto, UserAccount userAccount, long operationId) {
}
