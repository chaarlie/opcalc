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
public class UserAccount {
    private long id;

    private String username;

    private String password;

    private UserAccountStatus status;

    private BigDecimal balance;

    public boolean withdraw(BigDecimal amount) {
        boolean hasCredit = balance.compareTo(amount) >= 0;

        if (hasCredit) {
            this.setBalance(balance.subtract(amount));
        }

        return hasCredit;
    }
}
