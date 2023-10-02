import { render } from '@testing-library/react'
import { App } from '../../../components/app'
import { GlobalContext } from '../../../context/GlobalContext'

describe('Authenticated', () => {
    it('should render the Authenticated route if user is logged in', async () => {
        const { getByTestId, getByText } = render(
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
                <App url="/authenticated" />
            </GlobalContext.Provider>,
        )

        const app = getByTestId('app-container')
        expect(app).not.toBeNull()

        expect(getByText(/Welcome/i)).toBeInTheDocument()
    })

    it('should not to render the login route if user is not logged in', async () => {
        const { getByTestId, getByText } = render(
            <GlobalContext.Provider
                value={{
                    userDetails: null,
                    balance: 10,
                    setBalance: (balance: number) => 10,
                    logout: () => {},
                    setUserDetails: () => {},
                }}
            >
                <App url="/authenticated" />
            </GlobalContext.Provider>,
        )

        const app = getByTestId('app-container')
        expect(app).not.toBeNull()

        expect(getByText(/Login to your account/i)).toBeInTheDocument()
    })
})
