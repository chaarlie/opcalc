package com.opcalc.common.application.port.output;

import org.springframework.data.domain.Pageable;

public record FindAllRecordsPaginatedCommand(long accountUserId, Pageable pageable) {
}
