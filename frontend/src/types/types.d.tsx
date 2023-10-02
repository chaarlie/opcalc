import { Method } from 'axios'

export enum OPERATION_ENUM {
    ADDITION = 'ADDITION',
    SUBTRACTION = 'SUBTRACTION',
    DIVISION = 'DIVISION',
    MULTIPLICATION = 'MULTIPLICATION',
    RANDOM_STRING = 'RANDOM_STRING',
    SQUARE_ROOT = 'SQUARE_ROOT',
}

export type OperationRecord = {
    id: number
    operationId: number
    accountUserId: number
    amount: number
    userAccountBalance: number
    operationResponse: string
    date: string
    isDeleted: boolean
}
export type AxiosCallData = {
    method: Method
    url: string
    params?: any
    token?: string
}

export interface ValidOPeration {
    type: OPERATION_ENUM
    cost: number
    symbol: string
    id: number
}

export type UserDetails = {
    id: number
    token: string
    username: string
}

export type OperationData = {
    operand1?: number
    operand2?: number
}

export type PerformedOperationResponse = {
    operationResponse: string
    status: number
}

export type GlobalContextState = {
    userDetails: UserDetails | null
    balance: number
    setBalance: (balance: number) => void
    setUserDetails: (user: UserDetails) => void
    logout: () => void
}
