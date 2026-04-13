import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import StarterPage from '../steps/StarterPage'

describe('StarterPage', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            render(<StarterPage onStart={vi.fn()} />)
        })

        it('renders the "Job Application" heading', () => {
            render(<StarterPage onStart={vi.fn()} />)
            expect(
                screen.getByRole('heading', { name: /Job Application/i })
            ).toBeInTheDocument()
        })

        it('renders the heading as an h1 element', () => {
            render(<StarterPage onStart={vi.fn()} />)
            const heading = screen.getByRole('heading', { level: 1 })
            expect(heading).toBeInTheDocument()
            expect(heading).toHaveTextContent(/Job Application/i)
        })

        it('renders the START button', () => {
            render(<StarterPage onStart={vi.fn()} />)
            expect(
                screen.getByRole('button', { name: /START/i })
            ).toBeInTheDocument()
        })
    })

    describe('interaction', () => {
        it('calls onStart when the START button is clicked', async () => {
            const onStart = vi.fn()
            render(<StarterPage onStart={onStart} />)
            await userEvent.click(
                screen.getByRole('button', { name: /START/i })
            )
            expect(onStart).toHaveBeenCalledTimes(1)
        })
    })
})
