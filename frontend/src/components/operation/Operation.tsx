import { useState, useContext, useEffect, FormEvent, useRef } from 'react'
import { GlobalContext } from '../../context/GlobalContext'
import { useAxios } from '../../hooks'
import { AxiosCallData, ValidOPeration } from '../../types'
import { OperationResult, OperationInput } from '.'
import { OPERATION_ENUM, PerformedOperationResponse } from '../../types'

function Operation() {
    const { userDetails, setBalance } = useContext(GlobalContext)
    const [operationsCallData, setOperationsCallData] =
        useState<AxiosCallData | null>(null)
    const { axiosResponse: operationsResponse } = useAxios(
        operationsCallData?.url!,
        operationsCallData?.method!,
        operationsCallData?.params,
        operationsCallData?.token,
    )
    const [performOperationCallData, setPerformOperationCallData] =
        useState<AxiosCallData | null>(null)
    const {
        axiosResponse: performOperationCallDataResponse,
        axiosError: performOperationCallDataError,
    } = useAxios(
        performOperationCallData?.url!,
        performOperationCallData?.method!,
        performOperationCallData?.params,
        performOperationCallData?.token,
    )
    const [balanceOperationCallData, setBalanceOperationCallData] =
        useState<AxiosCallData | null>(null)
    const { axiosResponse: balanceOperationCallDataResponse } = useAxios(
        balanceOperationCallData?.url!,
        balanceOperationCallData?.method!,
        balanceOperationCallData?.params,
        balanceOperationCallData?.token,
    )
    const [validOperations, setValidOperations] = useState<ValidOPeration[]>([])
    const [selectedOperationId, setSelectedOperationId] = useState<
        number | null
    >(null)
    const [validOperationType, setValidOperationType] =
        useState<OPERATION_ENUM | null>(null)
    const [performedOperationResponse, setPerformedOperationResponse] =
        useState<PerformedOperationResponse | null>(null)

    const formRef = useRef<HTMLFormElement>(null)

    const [operand1, setOperand1] = useState<number>(0)
    const [operand2, setOperand2] = useState<number>(0)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (selectedOperationId) {
            const params = {
                operand1: Number(operand1),
                operand2: Number(operand2),
            }

            if (formRef) {
                formRef.current?.reset()
                setOperand1(0)
                setOperand2(0)
            }

            setPerformOperationCallData({
                method: 'POST',
                url: `/operation/${selectedOperationId}`,
                token: userDetails?.token,
                params,
            })
        }
    }

    useEffect(() => {
        setOperationsCallData({
            method: 'GET',
            url: '/operation',
            token: userDetails?.token,
        })
    }, [])

    useEffect(() => {
        if (operationsResponse?.data) {
            setValidOperations(operationsResponse.data)
        }
    }, [operationsResponse])

    useEffect(() => {
        if (balanceOperationCallDataResponse?.status) {
            setBalance(balanceOperationCallDataResponse.data)

            setBalanceOperationCallData(null)
        }
    }, [balanceOperationCallDataResponse])

    useEffect(() => {
        if (performOperationCallDataResponse?.status === 200) {
            setPerformedOperationResponse({
                operationResponse: performOperationCallDataResponse.data,
                status: performOperationCallDataResponse.status,
            })

            setPerformOperationCallData(null)
            setSelectedOperationId(null)

            setBalanceOperationCallData({
                method: 'GET',
                url: `/user/${userDetails?.id}/balance`,
                token: userDetails?.token,
            })
        }
    }, [performOperationCallDataResponse])

    useEffect(() => {
        if (
            performOperationCallDataError?.message &&
            performOperationCallDataError?.request?.status
        ) {
            setPerformedOperationResponse({
                operationResponse: performOperationCallDataError.message,
                status: performOperationCallDataError?.request.status,
            })
        }
    }, [performOperationCallDataError])

    useEffect(() => {
        const validOperation = validOperations.find(
            validOperation => validOperation.id === selectedOperationId,
        )

        if (validOperation) {
            setValidOperationType(validOperation.type)
        }
    }, [selectedOperationId])

    return (
        <div className="card">
            <form
                onSubmit={e => handleSubmit(e)}
                className="card-body d-flex justify-content-center "
                ref={formRef}
            >
                <div className="d-flex flex-column col-md-1">
                    {validOperations.length > 0 &&
                        validOperations.map(operation => (
                            <button
                                data-testid="operation-exec-button"
                                key={operation.id}
                                type="button"
                                className="btn btn-primary p-1 mt-2 fs-3 fw-bold"
                                onClick={() =>
                                    setSelectedOperationId(operation.id)
                                }
                            >
                                {operation.symbol}
                            </button>
                        ))}
                </div>

                <div className="ms-4 align-self-center col-md-6 ">
                    {validOperationType && (
                        <OperationInput
                            operationType={validOperationType}
                            operand1={operand1}
                            operand2={operand2}
                            setOperand1={setOperand1}
                            setOperand2={setOperand2}
                        />
                    )}

                    <div className="form-group">
                        <div className="col-md-6 mx-auto">
                            <button
                                data-testid="operation-submit-button"
                                type="submit"
                                className="btn btn-primary p-2 form-control"
                            >
                                Execute
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="">
                            <h5 className="">Result</h5>
                            <p className="card-text">
                                This is the computed result:{' '}
                                {performedOperationResponse && (
                                    <OperationResult
                                        operationResponse={
                                            performedOperationResponse.operationResponse
                                        }
                                        status={
                                            performedOperationResponse.status
                                        }
                                    />
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Operation
