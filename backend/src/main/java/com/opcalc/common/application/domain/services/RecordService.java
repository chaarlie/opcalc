package com.opcalc.common.application.domain.services;

import com.opcalc.common.adapter.out.persistence.RecordEntity;
import com.opcalc.common.adapter.out.persistence.RecordRepository;
import com.opcalc.common.application.port.input.DeleteRecordByIdCommand;
import com.opcalc.common.application.port.input.DeleteRecordUseCase;
import com.opcalc.common.application.port.output.FindAllRecordsPaginatedCommand;
import com.opcalc.common.application.port.output.FindRecordUseCase;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class RecordService implements FindRecordUseCase, DeleteRecordUseCase {

    private final RecordRepository recordRepository;

    @Override
    public Page<RecordEntity> findAllUserAccountRecordsPaginated(
            FindAllRecordsPaginatedCommand findAllRecordsPaginatedCommand) {
        return recordRepository
                .findAllByAccountUserIdAndIsDeletedFalse(
                        findAllRecordsPaginatedCommand.accountUserId(),
                        findAllRecordsPaginatedCommand.pageable()
                );
    }

    @Override
    @Transactional
    public Long deleteOne(DeleteRecordByIdCommand deleteRecordByIdCommand) {
        RecordEntity recordEntity = recordRepository.findById(deleteRecordByIdCommand.id()).orElseThrow();

        if (recordEntity.getIsDeleted()) {
            throw new NoSuchElementException("Already deleted");
        }

        recordEntity.setIsDeleted(true);
        recordRepository.save(recordEntity);

        return deleteRecordByIdCommand.id();
    }
}
