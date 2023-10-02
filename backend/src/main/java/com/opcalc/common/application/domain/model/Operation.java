package com.opcalc.common.application.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Operation {
    private long id;

    private OperationType type;

    private BigDecimal cost;

    private String symbol;
}
