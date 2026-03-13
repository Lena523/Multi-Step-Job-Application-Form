import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Step4SuccessPage from '../steps/Step4SuccessPage'

describe('Step4SuccessPage', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            render(<Step4SuccessPage />)
        })

        it('renders the "Application Submitted" heading', () => {
            render(<Step4SuccessPage />)
            expect(
                screen.getByText(/Application Submitted/i)
            ).toBeInTheDocument()
        })

        it('renders the success message paragraph', () => {
            render(<Step4SuccessPage />)
            expect(
                screen.getByText(
                    /Thank you! Your job application has been successfully submitted\./i
                )
            ).toBeInTheDocument()
        })

        it('renders the heading as an h2 element', () => {
            render(<Step4SuccessPage />)
            const heading = screen.getByRole('heading', { level: 2 })
            expect(heading).toBeInTheDocument()
            expect(heading).toHaveTextContent(/Application Submitted/i)
        })

        it('renders a wrapping div with text-center class', () => {
            const { container } = render(<Step4SuccessPage />)
            const wrapper = container.firstChild as HTMLElement
            expect(wrapper).toHaveClass('text-center')
        })
    })
})
