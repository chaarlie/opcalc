package com.opcalc.common.application.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Record {
    private long id;

    private long operationId;

    private long accountUserId;

    private BigDecimal amount;

    private BigDecimal userAccountBalance;

    private String operationResponse;

    private Date date;
}
