import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { App } from '../../../components/app'
import { setupServer } from 'msw/node'
import { GlobalContext } from '../../../context/GlobalContext'

describe('Operation', () => {
    const operations = [
        {
            type: 'SUBTRACTION',
            cost: 3.0,
            symbol: '-',
            id: 1,
        },
        {
            type: 'MULTIPLICATION',
            cost: 5.0,
            symbol: '*',
            id: 2,
        },
        {
            type: 'RANDOM_STRING',
            cost: 1.0,
            symbol: 'RAND',
            id: 3,
        },
        {
            type: 'ADDITION',
            cost: 8.0,
            symbol: '+',
            id: 4,
        },
        {
            type: 'SQUARE_ROOT',
            cost: 1.0,
            symbol: '√',
            id: 5,
        },
        {
            type: 'DIVISION',
            cost: 2.0,
            symbol: '/',
            id: 6,
        },
    ]

    const loadOperationsHandler = rest.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/operation`,
        async (_, res, ctx) => {
            const body = operations
            return res(
                ctx.set('Content-Type', 'application/json'),
                ctx.json(body),
            )
        },
    )

    const performOperationHandler = rest.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/operation/1`,
        async (_, res, ctx) => {
            return res(
                ctx.set('Content-Type', 'application/json'),
                ctx.body('2'),
            )
        },
    )

    const getUserBalance = rest.get(
        `${process.env.REACT_APP_BACKEND_API_URL}/user/1/balance`,
        async (_, res, ctx) => {
            return res(
                ctx.set('Content-Type', 'application/json'),
                ctx.body('13'),
            )
        },
    )

    const mswServer = setupServer(
        loadOperationsHandler,
        performOperationHandler,
        getUserBalance,
    )

    beforeAll(() => mswServer.listen())
    afterEach(() => mswServer.resetHandlers())
    afterAll(() => mswServer.close())

    it('should render the total number of operations from array', async () => {
        const { getAllByTestId } = render(
            <GlobalContext.Provider
                value={{
                    userDetails: {
                        id: 1,
                        username: 'chaarlie@hotmail.com',
                        token: 'hashToken',
                    },
                    balance: 10,
                    setBalance: (balance: number) => 10,
                    logout: () => {},
                    setUserDetails: () => {},
                }}
            >
                <App url="/authenticated/operation" />
            </GlobalContext.Provider>,
        )

        await waitFor(() => {
            expect(getAllByTestId('operation-exec-button')).toHaveLength(
                operations.length,
            )
        })
    })

    it('should create an operation request', async () => {
        let operationButtons: any[] = []

        const { getAllByTestId, getByTestId, getByText } = render(
            <GlobalContext.Provider
                value={{
                    userDetails: {
                        id: 1,
                        username: 'chaarlie@hotmail.com',
                        token: 'hashToken',
                    },
                    balance: 10,
                    setBalance: (balance: number) => 10,
                    logout: () => {},
                    setUserDetails: () => {},
                }}
            >
                <App url="/authenticated/operation" />
            </GlobalContext.Provider>,
        )

        await waitFor(() => {
            operationButtons = getAllByTestId('operation-exec-button')
        })

        await act(() => {
            fireEvent.click(operationButtons[0])
        })

        const operand1Input = getByTestId('operation-operand1-input')
        const operand2Input = getByTestId('operation-operand2-input')
        const operationSubmit = getByTestId('operation-submit-button')

        fireEvent.change(operand1Input, { target: { value: '5' } })
        fireEvent.change(operand2Input, { target: { value: '3' } })

        fireEvent.click(operationSubmit)

        await waitFor(() => {
            const el = getByText('This is the computed result:', {
                exact: false,
            })
            expect(el.textContent).toEqual('This is the computed result: 2')
        })
    })
})
