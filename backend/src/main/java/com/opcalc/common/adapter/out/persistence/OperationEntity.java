package com.opcalc.common.adapter.out.persistence;

import com.opcalc.common.application.domain.model.OperationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Entity(name = "operation")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OperationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperationType type;

    @Column(nullable = false)
    private BigDecimal cost;

    @Column(nullable = false)
    private String symbol;
}
