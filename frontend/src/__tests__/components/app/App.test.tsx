import {  render } from '@testing-library/react'
import { App } from '../../../components/app'

describe('App', () => {
    it('renders the app', async () => {
        const { getByTestId } = render(<App />)
        getByTestId('app-container')
    })

    it('should render Login component by default', async () => {
        const { getByTestId, getByText } = render(<App />)

        const app = getByTestId('app-container')
        expect(app).not.toBeNull()

        expect(getByText(/Login to your account/i)).toBeInTheDocument()
    })
})
