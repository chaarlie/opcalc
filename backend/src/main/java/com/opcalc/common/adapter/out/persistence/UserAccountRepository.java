package com.opcalc.common.adapter.out.persistence;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository  extends CrudRepository<UserAccountEntity, Long> {
    Optional<UserAccountEntity> findByUsername(String username);
}
