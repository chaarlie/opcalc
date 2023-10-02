package com.opcalc.common.application.domain.services;

import com.opcalc.common.adapter.out.persistence.*;
import com.opcalc.common.application.domain.dto.OperationInputDto;
import com.opcalc.common.application.domain.factory.ArithmeticOperationFactory;
import com.opcalc.common.application.domain.factory.MultiplicationOperation;
import com.opcalc.common.application.domain.model.OperationType;
import com.opcalc.common.application.domain.model.UserAccount;
import com.opcalc.common.application.port.input.PerformOperationCommand;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OperationServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private OperationService operationService;

    @Mock
    private OperationRepository operationRepository;

    @Mock
    private ArithmeticOperationFactory arithmeticOperationFactory;

    @Mock
    private RecordRepository recordRepository;

    @Test
    void verifyMultiplicationReturnsTheCorrectResultIfUserHasBalance() {
        long operationId = 1L;
        BigDecimal operationCost = new BigDecimal(5);
        BigDecimal userBalance = new BigDecimal(10);

        OperationEntity operationEntity = OperationEntity.builder()
                .id(operationId)
                .cost(operationCost)
                .type(OperationType.MULTIPLICATION)
                .symbol("*")
                .build();

        UserAccount userAccount = UserAccount.builder()
                .id(1L)
                .balance(userBalance)
                .build();

        PerformOperationCommand performOperationCommand = new PerformOperationCommand(
                OperationInputDto.builder()
                        .operand1(new BigDecimal(3))
                        .operand2(new BigDecimal(4))
                        .build(),
                userAccount,
                operationId
        );

        when(operationRepository.findById(operationId)).thenReturn(Optional.ofNullable(operationEntity));

        when(arithmeticOperationFactory.getOperation(operationEntity.getType())).thenReturn(new MultiplicationOperation());

        assertEquals(operationService.exectue(performOperationCommand), "12");
    }

    @Test
    void verifyAnExecptionIsThrownIfUserDoesntHaveEnoughBalance() {
        long operationId = 1L;
        BigDecimal operationCost = new BigDecimal(3);
        BigDecimal userBalance = new BigDecimal(2);

        OperationEntity operationEntity = OperationEntity.builder()
                .id(operationId)
                .cost(operationCost)
                .type(OperationType.MULTIPLICATION)
                .symbol("*")
                .build();

        UserAccount userAccount = UserAccount.builder()
                .id(1L)
                .balance(userBalance)
                .build();

        PerformOperationCommand performOperationCommand = new PerformOperationCommand(
                OperationInputDto.builder()
                        .operand1(new BigDecimal(3))
                        .operand2(new BigDecimal(4))
                        .build(),
                userAccount,
                operationId
        );

        RecordEntity recordEntity = RecordEntity.builder()
                .operationId(1L)
                .accountUserId(userAccount.getId())
                .amount(operationEntity.getCost())
                .userAccountBalance(userAccount.getBalance())
                .isDeleted(false)
                .build();

        lenient().when(recordRepository.save(recordEntity)).thenReturn(recordEntity);
        when(operationRepository.findById(operationId)).thenReturn(Optional.ofNullable(operationEntity));

        assertThrows(InsufficientFundsException.class,
                () -> operationService.exectue(performOperationCommand));
    }
}
