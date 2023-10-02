package com.opcalc.common.application.domain.services;

import com.opcalc.common.adapter.out.persistence.UserAccountEntity;
import com.opcalc.common.adapter.out.persistence.UserAccountRepository;
import com.opcalc.common.application.domain.model.UserAccount;
import com.opcalc.common.application.domain.model.UserAccountStatus;
import com.opcalc.common.application.port.input.CreateOneUserAccountCommand;
import com.opcalc.common.application.port.input.CreateUserAccountUseCase;
import com.opcalc.common.application.port.output.FindUserAccountBalanceByIdCommand;
import com.opcalc.common.application.port.output.FindUserAccountByUsernameCommand;
import com.opcalc.common.application.port.output.FindUserAccountUseCase;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@AllArgsConstructor
public class UserAccountService implements CreateUserAccountUseCase, FindUserAccountUseCase {
    public final UserAccountRepository userAccountRepository;

    public final PasswordEncoder passwordEncoder;

    @Override
    public long createOne(CreateOneUserAccountCommand createOneCommand) {
        UserAccountEntity createdUserEntity = userAccountRepository.save(
                UserAccountEntity.builder()
                        .id(0L)
                        .username(createOneCommand.userAccountInputDto().getUsername())
                        .password(passwordEncoder.encode(createOneCommand.userAccountInputDto().getPassword()))
                        .status(UserAccountStatus.ACTIVE)
                        .balance(new BigDecimal(20))
                        .build()
        );

        return createdUserEntity.getId();
    }

    @Override
    public UserAccount findByUsername(FindUserAccountByUsernameCommand findUserAccountByUsernameCommand) {
        UserAccountEntity foundUserEntity = userAccountRepository
                .findByUsername(findUserAccountByUsernameCommand.username())
                .orElseThrow();

        return UserAccount.builder()
                .id(foundUserEntity.getId())
                .username(foundUserEntity.getUsername())
                .password(foundUserEntity.getPassword())
                .status(foundUserEntity.getStatus())
                .balance(foundUserEntity.getBalance())
                .build();
    }

    @Override
    public BigDecimal findBalanceById(FindUserAccountBalanceByIdCommand findUserAccountBalanceByIdCommand) {
        UserAccountEntity userAccountEntity = userAccountRepository
                .findById(findUserAccountBalanceByIdCommand.id()).orElseThrow();
        return userAccountEntity.getBalance();
    }
}
