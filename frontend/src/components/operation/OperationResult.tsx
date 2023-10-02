import { PerformedOperationResponse } from '../../types'

function OperationResult({
    operationResponse,
    status,
}: PerformedOperationResponse) {
    const isResponseOk = status >= 200 && status < 300

    return (
        <>
            {isResponseOk ? (
                <span className="badge bg-success bg-gradient fs-6">
                    {operationResponse}
                </span>
            ) : (
                <span className="badge bg-danger bg-gradient fs-6">
                    {operationResponse}
                </span>
            )}
        </>
    )
}

export default OperationResult
