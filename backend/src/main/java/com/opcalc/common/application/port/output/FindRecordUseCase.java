package com.opcalc.common.application.port.output;

import com.opcalc.common.adapter.out.persistence.RecordEntity;
import org.springframework.data.domain.Page;

public interface FindRecordUseCase {
    Page<RecordEntity> findAllUserAccountRecordsPaginated(FindAllRecordsPaginatedCommand findAllRecordsPaginatedCommand);
}
