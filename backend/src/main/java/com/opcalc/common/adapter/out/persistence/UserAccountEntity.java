package com.opcalc.common.adapter.out.persistence;

import com.opcalc.common.application.domain.model.UserAccountStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity(name = "user")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserAccountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserAccountStatus status =  UserAccountStatus.ACTIVE;

    @Column(nullable = false)
    private BigDecimal balance;
}
