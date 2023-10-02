package com.opcalc.common.application.domain.services;


import com.opcalc.common.adapter.out.persistence.UserAccountEntity;
import com.opcalc.common.adapter.out.persistence.UserAccountRepository;
import com.opcalc.common.application.domain.dto.UserAccountInputDto;
import com.opcalc.common.application.domain.model.UserAccount;
import com.opcalc.common.application.domain.model.UserAccountStatus;
import com.opcalc.common.application.port.input.CreateOneUserAccountCommand;
import com.opcalc.common.application.port.output.FindUserAccountBalanceByIdCommand;
import com.opcalc.common.application.port.output.FindUserAccountByUsernameCommand;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserAccountServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private UserAccountService userAccountService;

    @Mock
    private PasswordEncoder passwordEncoder = new PasswordEncoder() {

        public String encode(CharSequence rawPassword) {
            return null;
        }

        @Override
        public boolean matches(CharSequence rawPassword, String encodedPassword) {
            return false;
        }
    };

    @Test
    void verifyThatAnUserIsCreated() {
        UserAccountEntity userAccount = UserAccountEntity.builder()
                .id(0L)
                .username("username")
                .balance(new BigDecimal(20))
                .status(UserAccountStatus.ACTIVE)
                .build();

        when(userAccountRepository.save(userAccount)).thenReturn(userAccount);

        UserAccountInputDto input = UserAccountInputDto.builder().username(userAccount.getUsername()).password(userAccount.getPassword()).build();

        assertEquals(userAccountService.createOne(new CreateOneUserAccountCommand(input)), 0);
    }

    @Test
    void verifyFindByUsernameReturnsAFoundUser() {
        UserAccountEntity userAccount = UserAccountEntity.builder()
                .id(0L)
                .username("chaarlie")
                .balance(new BigDecimal(20))
                .status(UserAccountStatus.ACTIVE)
                .build();

        when(userAccountRepository.findByUsername("chaarlie")).thenReturn(Optional.ofNullable(userAccount));

        UserAccount foundMock = userAccountService.findByUsername(new FindUserAccountByUsernameCommand("chaarlie"));

        assertEquals(foundMock.getUsername(), userAccount.getUsername());
        assertEquals(foundMock.getId(), userAccount.getId());
        assertEquals(foundMock.getPassword(), userAccount.getPassword());
        assertEquals(foundMock.getBalance(), userAccount.getBalance());
    }

    @Test
    void verifyUserBalancedIsReturnedById() {
        long userId = 1L;
        BigDecimal balance = new BigDecimal(20);

        UserAccountEntity userAccount = UserAccountEntity.builder()
                .id(userId)
                .username("chaarlie")
                .balance(balance)
                .status(UserAccountStatus.ACTIVE)
                .build();

        when(userAccountRepository.findById(userId)).thenReturn(Optional.ofNullable(userAccount));

        assertEquals(userAccountService.findBalanceById(new FindUserAccountBalanceByIdCommand(userId)), balance);
    }
}
