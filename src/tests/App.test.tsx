import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from '../App'

vi.mock('../steps/StarterPage', () => ({
    default: ({ onStart }: { onStart: () => void }) => (
        <div>
            <span>StarterPage</span>
            <button onClick={onStart}>START</button>
        </div>
    ),
}))

vi.mock('../steps/Step1PersonalInfo', () => ({
    default: ({ onNext }: { onNext: () => void }) => (
        <div>
            <span>Step1PersonalInfo</span>
            <button onClick={onNext}>Next</button>
        </div>
    ),
}))

vi.mock('../steps/Step2Experience', () => ({
    default: ({
        onNext,
        onBack,
    }: {
        onNext: () => void
        onBack: () => void
    }) => (
        <div>
            <span>Step2Experience</span>
            <button onClick={onBack}>Back</button>
            <button onClick={onNext}>Next</button>
        </div>
    ),
}))

vi.mock('../steps/Step3Review', () => ({
    default: ({
        onBack,
        onSubmitSuccess,
    }: {
        onBack: () => void
        onSubmitSuccess: () => void
    }) => (
        <div>
            <span>Step3Review</span>
            <button onClick={onBack}>Back</button>
            <button onClick={onSubmitSuccess}>Submit</button>
        </div>
    ),
}))

vi.mock('../steps/Step4SuccessPage', () => ({
    default: () => <div>Step4SuccessPage</div>,
}))

vi.mock('../components/progress-indicator/ProgressIndicator', () => ({
    ProgressIndicator: ({ step }: { step: number }) => (
        <div data-testid="progress-indicator">Step {step} of 4</div>
    ),
}))

vi.mock('../hooks/useFormPersist', () => ({
    useFormPersist: vi.fn(),
}))

describe('App', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    describe('rendering', () => {
        it('renders without crashing', () => {
            render(<App />)
            expect(screen.getByText('StarterPage')).toBeInTheDocument()
        })

        it('renders StarterPage on initial load', () => {
            render(<App />)
            expect(screen.getByText('StarterPage')).toBeInTheDocument()
        })

        it('does not render ProgressIndicator on initial load', () => {
            render(<App />)
            expect(
                screen.queryByTestId('progress-indicator')
            ).not.toBeInTheDocument()
        })

        it('does not render Step1PersonalInfo on initial load', () => {
            render(<App />)
            expect(
                screen.queryByText('Step1PersonalInfo')
            ).not.toBeInTheDocument()
        })

        it('does not render Step2Experience on initial load', () => {
            render(<App />)
            expect(
                screen.queryByText('Step2Experience')
            ).not.toBeInTheDocument()
        })

        it('does not render Step3Review on initial load', () => {
            render(<App />)
            expect(screen.queryByText('Step3Review')).not.toBeInTheDocument()
        })

        it('does not render Step4SuccessPage on initial load', () => {
            render(<App />)
            expect(
                screen.queryByText('Step4SuccessPage')
            ).not.toBeInTheDocument()
        })
    })

    describe('ProgressIndicator', () => {
        it('shows step 1 in the progress indicator after clicking START', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() =>
                expect(
                    screen.getByTestId('progress-indicator')
                ).toHaveTextContent('Step 1 of 4')
            )
        })

        it('updates progress indicator when advancing to step 2', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() =>
                expect(
                    screen.getByTestId('progress-indicator')
                ).toHaveTextContent('Step 2 of 4')
            )
        })
    })

    describe('step navigation – forward', () => {
        it('advances from StarterPage to step 1 when START is clicked', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() =>
                expect(
                    screen.getByText('Step1PersonalInfo')
                ).toBeInTheDocument()
            )
        })

        it('advances from step 1 to step 2 when Next is clicked', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() =>
                expect(screen.getByText('Step2Experience')).toBeInTheDocument()
            )
        })

        it('advances from step 2 to step 3 when Next is clicked', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Step2Experience'))
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() =>
                expect(screen.getByText('Step3Review')).toBeInTheDocument()
            )
        })

        it('advances from step 3 to step 4 when Submit is clicked', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))

            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Step2Experience'))

            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Step3Review'))

            await userEvent.click(
                screen.getByRole('button', { name: /submit/i })
            )
            await waitFor(() =>
                expect(screen.getByText('Step4SuccessPage')).toBeInTheDocument()
            )
        })
    })

    describe('step navigation – back', () => {
        it('goes back from step 2 to step 1 when Back is clicked', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Step2Experience'))
            await userEvent.click(screen.getByRole('button', { name: /back/i }))
            await waitFor(() =>
                expect(
                    screen.getByText('Step1PersonalInfo')
                ).toBeInTheDocument()
            )
        })

        it('goes back from step 3 to step 2 when Back is clicked', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))

            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Step2Experience'))

            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Step3Review'))

            await userEvent.click(screen.getByRole('button', { name: /back/i }))
            await waitFor(() =>
                expect(screen.getByText('Step2Experience')).toBeInTheDocument()
            )
        })
    })

    describe('localStorage persistence', () => {
        it('persists the current step to localStorage when navigating from StarterPage', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))
            expect(localStorage.getItem('jobApplicationStep')).toBe('1')
        })

        it('persists the current step to localStorage when navigating forward', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Step2Experience'))
            expect(localStorage.getItem('jobApplicationStep')).toBe('2')
        })

        it('persists the current step to localStorage when navigating back', async () => {
            render(<App />)
            await userEvent.click(
                screen.getByRole('button', { name: /start/i })
            )
            await waitFor(() => screen.getByText('Step1PersonalInfo'))
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Step2Experience'))
            await userEvent.click(screen.getByRole('button', { name: /back/i }))
            await waitFor(() => screen.getByText('Step1PersonalInfo'))
            expect(localStorage.getItem('jobApplicationStep')).toBe('1')
        })

        it('restores the step from localStorage on mount', () => {
            localStorage.setItem('jobApplicationStep', '2')
            render(<App />)
            expect(screen.getByText('Step2Experience')).toBeInTheDocument()
        })

        it('starts at StarterPage when localStorage has no saved step', () => {
            render(<App />)
            expect(screen.getByText('StarterPage')).toBeInTheDocument()
        })
    })
})
