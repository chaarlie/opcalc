package com.opcalc.common.application.port.input;

import com.opcalc.common.application.domain.dto.UserAccountInputDto;

public record CreateOneUserAccountCommand(UserAccountInputDto userAccountInputDto) {
}
