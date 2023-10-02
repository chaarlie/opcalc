package com.opcalc.common.adapter.out.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.type.NumericBooleanConverter;

import java.math.BigDecimal;
import java.util.Date;
@Entity(name = "record")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private long operationId;

    @Column(nullable = false)
    private long accountUserId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private BigDecimal userAccountBalance;

    @Column(nullable = false)
    private String operationResponse;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    @Convert(converter = NumericBooleanConverter.class)
    private Boolean isDeleted;
}
