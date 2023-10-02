import { render } from '@testing-library/react'
import { CurrentBalance } from '../../../components/authenticated'

describe('CurrentBalance', () => {
    it('should render current balance with specified value', async () => {
        const balance = 55

        const { findByText } = render(<CurrentBalance balance={balance} />)

        expect(findByText(balance)).not.toBeNull()
    })
})
