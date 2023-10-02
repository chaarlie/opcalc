package com.opcalc.common.application.domain.services;

import java.math.BigDecimal;

public class InsufficientFundsException extends RuntimeException {
    InsufficientFundsException(BigDecimal userCredit, BigDecimal operationCost) {
        super(String.format("Insufficient funds: The user has $%.02f on his balance, but this operation cost $%.02f",
                userCredit,
                operationCost
        ));
    }
}
