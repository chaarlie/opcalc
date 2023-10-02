package com.opcalc.common.application.port.output;

import com.opcalc.common.application.domain.model.UserAccount;

import java.math.BigDecimal;

public interface FindUserAccountUseCase {
    UserAccount findByUsername(FindUserAccountByUsernameCommand findUserAccountByUsernameCommand);

    BigDecimal findBalanceById(FindUserAccountBalanceByIdCommand findUserAccountBalanceByIdCommand);
}
