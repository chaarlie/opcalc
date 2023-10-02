import { OPERATION_ENUM } from '../../types/types.d'

interface OperationInputProps {
    operationType: OPERATION_ENUM
    operand1: number
    operand2: number
    setOperand1: (val: any) => void
    setOperand2: (val: any) => void
}

function OperationInput({
    operationType,
    operand1,
    operand2,
    setOperand1,
    setOperand2,
}: OperationInputProps) {
    switch (operationType) {
        case OPERATION_ENUM.SQUARE_ROOT:
            return (
                <div className=" m-5 d-flex justify-content-center align-items-center ">
                    <div className="card align-self-baseline">
                        <div className="card-body">
                            <h5 className="card-title">Operand 1</h5>
                            <input
                                onChange={e => setOperand1(e.target.value)}
                                type="number"
                                className="form-control p-4"
                                placeholder="0"
                                value={operand1}
                            />
                        </div>
                    </div>
                </div>
            )

        case OPERATION_ENUM.RANDOM_STRING:
            return (
                <div className=" m-5 d-flex justify-content-center align-items-center ">
                    <div className="card align-self-baseline">
                        <div className="card-body">
                            <h5 className="card-title">Random String</h5>
                        </div>
                    </div>
                </div>
            )
        default:
            return (
                <div className=" m-5 d-flex justify-content-center align-items-center ">
                    <div className="card align-self-baseline">
                        <div className="card-body">
                            <h5 className="card-title">Operand 1</h5>
                            <input
                                onChange={e => setOperand1(e.target.value)}
                                type="number"
                                className="form-control p-4"
                                placeholder="0"
                                value={operand1}
                                data-testid="operation-operand1-input"
                            />
                        </div>
                    </div>

                    <div className="card align-self-baseline">
                        <div className="card-body">
                            <h5 className="card-title">Operand 2</h5>
                            <input
                                onChange={e => setOperand2(e.target.value)}
                                type="number"
                                className="form-control p-4"
                                placeholder="0"
                                value={operand2}
                                data-testid="operation-operand2-input"
                            />
                        </div>
                    </div>
                </div>
            )
    }
}

export default OperationInput
