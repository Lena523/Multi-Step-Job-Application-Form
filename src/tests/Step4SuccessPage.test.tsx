import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import Step4SuccessPage from '../steps/Step4SuccessPage'

describe('Step4SuccessPage', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            render(<Step4SuccessPage onClose={vi.fn()} />)
        })

        it('renders the "Application Submitted" heading', () => {
            render(<Step4SuccessPage onClose={vi.fn()} />)
            expect(
                screen.getByText(/Application Submitted/i)
            ).toBeInTheDocument()
        })

        it('renders the success message paragraph', () => {
            render(<Step4SuccessPage onClose={vi.fn()} />)
            expect(
                screen.getByText(
                    /Thank you! Your job application has been successfully submitted\./i
                )
            ).toBeInTheDocument()
        })

        it('renders the heading as an h2 element', () => {
            render(<Step4SuccessPage onClose={vi.fn()} />)
            const heading = screen.getByRole('heading', { level: 2 })
            expect(heading).toBeInTheDocument()
            expect(heading).toHaveTextContent(/Application Submitted/i)
        })

        it('renders a wrapping div with text-center class', () => {
            const { container } = render(<Step4SuccessPage onClose={vi.fn()} />)
            const wrapper = container.firstChild as HTMLElement
            expect(wrapper).toHaveClass('text-center')
        })

        it('renders the CLOSE button', () => {
            render(<Step4SuccessPage onClose={vi.fn()} />)
            expect(
                screen.getByRole('button', { name: /close/i })
            ).toBeInTheDocument()
        })
    })

    describe('CLOSE button behaviour', () => {
        beforeEach(() => {
            localStorage.setItem(
                'jobApplicationData',
                JSON.stringify({ name: 'Alice' })
            )
            localStorage.setItem('jobApplicationStep', '4')
        })

        it('calls onClose when the CLOSE button is clicked', async () => {
            const onClose = vi.fn()
            render(<Step4SuccessPage onClose={onClose} />)

            await userEvent.click(
                screen.getByRole('button', { name: /close/i })
            )

            expect(onClose).toHaveBeenCalledTimes(1)
        })

        it('clears jobApplicationData from localStorage on close', async () => {
            const onClose = vi.fn(() => {
                localStorage.removeItem('jobApplicationData')
                localStorage.removeItem('jobApplicationStep')
            })
            render(<Step4SuccessPage onClose={onClose} />)

            await userEvent.click(
                screen.getByRole('button', { name: /close/i })
            )

            expect(localStorage.getItem('jobApplicationData')).toBeNull()
        })

        it('clears jobApplicationStep from localStorage on close', async () => {
            const onClose = vi.fn(() => {
                localStorage.removeItem('jobApplicationData')
                localStorage.removeItem('jobApplicationStep')
            })
            render(<Step4SuccessPage onClose={onClose} />)

            await userEvent.click(
                screen.getByRole('button', { name: /close/i })
            )

            expect(localStorage.getItem('jobApplicationStep')).toBeNull()
        })
    })
})
