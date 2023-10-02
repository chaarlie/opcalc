import { fireEvent, render, waitFor, act } from '@testing-library/react'
import * as router from 'react-router'
import { App } from '../../../components/app'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

describe('Login', () => {
    const mockRouteHandler = rest.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/auth/login`,
        async (_, res, ctx) => {
            const body = {
                id: 1,
                token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjaGFhcmxpZUBob3RtYWlsLmNvbSIsImlhdCI6MTY5NTkwMDM2MCwiZXhwIjoxNjk1OTAxODAwfQ.nKNlFylw1kP7ycaRf0I9md2rdh1JWA4PdIiatRveYK8',
                username: 'chaarlie@hotmail.com',
            }
            return res(
                ctx.set('Content-Type', 'application/json'),
                ctx.json(body),
            )
        },
    )

    const mswServer = setupServer(mockRouteHandler)

    const navigate = jest.fn()

    beforeAll(() => mswServer.listen())
    afterEach(() => mswServer.resetHandlers())
    afterAll(() => mswServer.close())

    beforeEach(() => {
        jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    })

    it('should navigate from Login to the authenticated route if response is successful', async () => {
        const { getByTestId } = render(<App />)

        const passwordInput = getByTestId('user-password')
        const emailInput = getByTestId('user-email')
        const submitButton = getByTestId('submit')

        await act(() => {
            fireEvent.change(emailInput, {
                target: { value: 'some@email.com' },
            })
            fireEvent.change(passwordInput, { target: { value: '1234' } })

            fireEvent.click(submitButton)
        })

        await waitFor(() =>
            expect(navigate).toHaveBeenCalledWith('/authenticated'),
        )
    })
})
