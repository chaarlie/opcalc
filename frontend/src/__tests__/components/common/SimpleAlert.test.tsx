import { render } from '@testing-library/react'
import { SimpleAlert } from '../../../components/common'

describe('SimpleAlert', () => {
    it('should render an Alert ', async () => {
        const message = 'New operation'

        const { container, getByText } = render(
            <SimpleAlert message={message} status={200} />,
        )

        const el = getByText(message, { exact: false })

        expect(el.textContent).toContain(message)
        expect(container.firstChild).toHaveClass('alert-success')
    })
})
