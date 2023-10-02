package com.opcalc.common.adapter.in.web;

import com.opcalc.common.adapter.out.persistence.RecordEntity;
import com.opcalc.common.application.domain.dto.OperationInputDto;
import com.opcalc.common.application.domain.model.Operation;
import com.opcalc.common.application.domain.model.UserAccount;
import com.opcalc.common.application.domain.services.InsufficientFundsException;
import com.opcalc.common.application.port.input.DeleteRecordByIdCommand;
import com.opcalc.common.application.port.input.DeleteRecordUseCase;
import com.opcalc.common.application.port.input.PerformOperationCommand;
import com.opcalc.common.application.port.input.PerformOperationUseCase;
import com.opcalc.common.application.port.output.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpServerErrorException;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RequestMapping("/api")
@RestController
@AllArgsConstructor
@CrossOrigin
public class AppController {
    private FindUserAccountUseCase findUserAccountUseCase;

    private FindRecordUseCase findRecordUseCase;

    private DeleteRecordUseCase deleteRecordUseCase;

    private FindOperationUseCase findOperationUseCase;

    private PerformOperationUseCase performOperationUseCase;


    @GetMapping(value = "/v1/user/{userId}/balance", headers = "api-version=1")
    public ResponseEntity<BigDecimal> findAllOperations(@PathVariable Long userId) {
        return ResponseEntity.ok(findUserAccountUseCase.findBalanceById(new FindUserAccountBalanceByIdCommand(userId)));
    }

    @PostMapping(value = "/v1/operation/{operationId}", headers = "api-version=1")
    @ResponseBody()
    public ResponseEntity<String> executeOperation(
            @PathVariable Long operationId,
            @RequestBody(required = false) OperationInputDto operationInputDto,
            Principal principal) {

        UserAccount userAccount = findUserAccountUseCase.findByUsername(
                new FindUserAccountByUsernameCommand(principal.getName()));

        String result = performOperationUseCase.exectue(
                new PerformOperationCommand(operationInputDto,
                        userAccount,
                        operationId)
        );

        return ResponseEntity.ok(result);

    }

    @GetMapping(value = "/v1/operation", headers = "api-version=1")
    public ResponseEntity<List<Operation>> findAllOperations() {
        return ResponseEntity.ok(findOperationUseCase.findAll());
    }

    @DeleteMapping(value = "/v1/record/{recordId}", headers = "api-version=1")
    public ResponseEntity<Long> deleteRecordById(@PathVariable Long recordId) {
        return ResponseEntity.ok(deleteRecordUseCase.deleteOne(new DeleteRecordByIdCommand(recordId)));
    }

    @GetMapping(value = "/v1/record/page", headers = "api-version=1")
    public ResponseEntity<Page<RecordEntity>> findAllPaginatedRecords(
            @RequestParam(required = false) Integer pageNo,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) Optional<String> sortBy,
            Principal principal
    ) {
        UserAccount userAccount = findUserAccountUseCase.findByUsername(
                new FindUserAccountByUsernameCommand(principal.getName()
                ));

        Pageable paging = PageRequest.of(pageNo, size, Sort.by(sortBy.orElse("id")));

        FindAllRecordsPaginatedCommand findAllRecordsPaginatedCommand = new FindAllRecordsPaginatedCommand(
                userAccount.getId(),
                paging
        );

        return ResponseEntity.ok(findRecordUseCase.findAllUserAccountRecordsPaginated(findAllRecordsPaginatedCommand));
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<String> handleInsufficientFundsException(InsufficientFundsException exception) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }

    @ExceptionHandler(HttpServerErrorException.InternalServerError.class)
    public ResponseEntity<String> handleInternalServerError(HttpServerErrorException.InternalServerError exception) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exception.getMessage());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<String> handleNoSuchElementException(NoSuchElementException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(exception.getMessage());
    }
}
