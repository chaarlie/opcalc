package com.opcalc.common.application.domain.services;

import com.opcalc.common.adapter.out.persistence.*;
import com.opcalc.common.application.domain.factory.*;
import com.opcalc.common.application.domain.model.Operation;
import com.opcalc.common.application.domain.model.OperationType;
import com.opcalc.common.application.domain.model.UserAccount;
import com.opcalc.common.application.port.input.PerformOperationCommand;
import com.opcalc.common.application.port.input.PerformOperationUseCase;
import com.opcalc.common.application.port.output.FindOperationByIdCommand;
import com.opcalc.common.application.port.output.FindOperationUseCase;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OperationService implements FindOperationUseCase, PerformOperationUseCase {

    private final OperationRepository operationRepository;

    private final UserAccountRepository userAccountRepository;

    private final RecordRepository recordRepository;

    private final ArithmeticOperationFactory arithmeticOperationFactory;

    private final OneOperandOperationFactory oneOperandOperationFactory;

    private final OperationFactory operationFactory;

    private void saveOperationRecord(RecordEntity recordEntity, String response) {
        recordEntity.setOperationResponse(response);
        recordEntity.setDate(new Date());
        recordRepository.save(recordEntity);
    }

    @Override
    public Operation findById(FindOperationByIdCommand findOperationByIdCommand) {
        OperationEntity foundOperation = operationRepository.findById(findOperationByIdCommand.id()).orElseThrow();

        return Operation.builder()
                .id(foundOperation.getId())
                .type(foundOperation.getType())
                .cost(foundOperation.getCost())
                .symbol(foundOperation.getSymbol())
                .build();
    }

    @Override
    @Transactional(noRollbackFor = {InsufficientFundsException.class})
    public String exectue(PerformOperationCommand performOperationCommand) {
        String operationResponse;

        OperationEntity currentOperation = operationRepository
                .findById(performOperationCommand.operationId()).orElseThrow();

        UserAccount currentUser = performOperationCommand.userAccount();

        RecordEntity recordEntity = RecordEntity.builder()
                .operationId(currentOperation.getId())
                .accountUserId(currentUser.getId())
                .amount(currentOperation.getCost())
                .userAccountBalance(currentUser.getBalance())
                .isDeleted(false)
                .build();

        boolean userHasBalance = currentUser.withdraw(currentOperation.getCost());

        if (!userHasBalance) {
            InsufficientFundsException insufficientFundsException =
                    new InsufficientFundsException(currentUser.getBalance(), currentOperation.getCost());

            saveOperationRecord(recordEntity, "Insufficient funds");

            throw insufficientFundsException;
        }

        userAccountRepository.save(
                new UserAccountEntity(
                        currentUser.getId(),
                        currentUser.getUsername(),
                        currentUser.getPassword(),
                        currentUser.getStatus(),
                        currentUser.getBalance()
                ));

        recordEntity.setUserAccountBalance(currentUser.getBalance());

        if (currentOperation.getType() == OperationType.RANDOM_STRING) {
            GenericOperation operation = operationFactory.getOperation(currentOperation.getType());

            operationResponse = operation.execute().toString();

            saveOperationRecord(recordEntity, operationResponse);

            return operationResponse;

        }

        if (currentOperation.getType() == OperationType.SQUARE_ROOT) {
            GenericOneOperandOperation operation = oneOperandOperationFactory.getOperation(currentOperation.getType());

            operationResponse = operation.execute(performOperationCommand.operationInputDto().getOperand1()).toString();

            saveOperationRecord(recordEntity, operationResponse);

            return operationResponse;

        }

        GenericArithmeticOperation genericArithmeticOperation = arithmeticOperationFactory
                .getOperation(currentOperation.getType());

        BigDecimal operand1 = performOperationCommand.operationInputDto().getOperand1();
        BigDecimal operand2 = performOperationCommand.operationInputDto().getOperand2();
        operationResponse = genericArithmeticOperation.execute(operand1, operand2).toString();

        saveOperationRecord(recordEntity, operationResponse);

        return operationResponse;
    }

    @Override
    public List<Operation> findAll() {
        return operationRepository.findAll().stream().map((operationEntity ->
                Operation.builder()
                        .id(operationEntity.getId())
                        .cost(operationEntity.getCost())
                        .type(operationEntity.getType())
                        .symbol(operationEntity.getSymbol())
                        .build()
        )).collect(Collectors.toList());
    }
}
