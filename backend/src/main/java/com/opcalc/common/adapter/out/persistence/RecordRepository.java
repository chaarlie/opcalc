package com.opcalc.common.adapter.out.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface RecordRepository extends CrudRepository<RecordEntity, Long> {
    Page<RecordEntity> findAllByAccountUserIdAndIsDeletedFalse(long accountUserId, Pageable pageable);
}
