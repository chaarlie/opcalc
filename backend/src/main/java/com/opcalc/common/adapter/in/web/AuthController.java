package com.opcalc.common.adapter.in.web;

import com.opcalc.common.adapter.out.auth.dto.AuthenticationResponseDto;
import com.opcalc.common.adapter.out.auth.service.JwtService;
import com.opcalc.common.application.domain.dto.UserAccountInputDto;
import com.opcalc.common.application.domain.model.UserAccount;
import com.opcalc.common.application.port.input.CreateOneUserAccountCommand;
import com.opcalc.common.application.port.input.CreateUserAccountUseCase;
import com.opcalc.common.application.port.output.FindUserAccountByUsernameCommand;
import com.opcalc.common.application.port.output.FindUserAccountUseCase;
import io.jsonwebtoken.ExpiredJwtException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpServerErrorException;

import java.sql.SQLIntegrityConstraintViolationException;

@RequestMapping("/api")
@RestController
@AllArgsConstructor
@CrossOrigin
public class AuthController {
    private JwtService jwtService;

    private AuthenticationManager authenticationManager;

    private CreateUserAccountUseCase createUserAccountUseCase;

    private FindUserAccountUseCase findUserAccountUseCase;

    @PostMapping(value = "/v1/auth/signup", headers = "api-version=1")
    public ResponseEntity<Long> signup(@RequestBody UserAccountInputDto userAccountInputDto) {
        return ResponseEntity.ok(
                createUserAccountUseCase.createOne(new CreateOneUserAccountCommand(userAccountInputDto))
        );
    }

    @PostMapping(value = "/v1/auth/login", headers = "api-version=1")
    public ResponseEntity<AuthenticationResponseDto> login(@RequestBody UserAccountInputDto userAccountInputDto) {
        Authentication authenticate =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                userAccountInputDto.getUsername(),
                                userAccountInputDto.getPassword()
                        ));

        if (authenticate.isAuthenticated()) {
            UserAccount userAccount = findUserAccountUseCase
                    .findByUsername(new FindUserAccountByUsernameCommand(userAccountInputDto.getUsername()));
            return ResponseEntity.ok(
                    new AuthenticationResponseDto(userAccount.getId(),
                            jwtService.generateToken(userAccountInputDto.getUsername()),
                            userAccount.getUsername()
                    ));
        }

        throw new BadCredentialsException("");
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleNoSuchElementFoundException(BadCredentialsException exception) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }

    @ExceptionHandler(SQLIntegrityConstraintViolationException.class)
    public ResponseEntity<String> handleSQLContraintViolation(SQLIntegrityConstraintViolationException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(exception.getMessage());
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String> handleExpiredJwtException(ExpiredJwtException exception) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(exception.getMessage());
    }

    @ExceptionHandler(HttpServerErrorException.InternalServerError.class)
    public ResponseEntity<String> handleInternalServerError(HttpServerErrorException.InternalServerError exception) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exception.getMessage());
    }
}
