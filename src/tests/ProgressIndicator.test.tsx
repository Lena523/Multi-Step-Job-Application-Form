import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressIndicator } from '../components/progress-indicator/ProgressIndicator'

describe('ProgressIndicator', () => {
    describe('rendering', () => {
        it('renders without crashing', () => {
            render(<ProgressIndicator step={1} />)
            expect(screen.getByText(/step/i)).toBeInTheDocument()
        })

        it('renders the step label with correct step and totalSteps', () => {
            render(<ProgressIndicator step={2} totalSteps={3} />)
            expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
        })

        it('renders the progress container element', () => {
            render(<ProgressIndicator step={1} totalSteps={3} />)
            const container = document.querySelector('.progress-container')
            expect(container).toBeInTheDocument()
        })

        it('renders the progress fill element', () => {
            render(<ProgressIndicator step={1} totalSteps={3} />)
            const fill = document.querySelector('.progress-fill')
            expect(fill).toBeInTheDocument()
        })
    })

    describe('default props', () => {
        it('defaults totalSteps to 3 when not provided', () => {
            render(<ProgressIndicator step={1} />)
            expect(screen.getByText('Step 1 of 3')).toBeInTheDocument()
        })

        it('defaults step to 0 when not provided', () => {
            // @ts-expect-error — testing runtime default for missing required prop
            render(<ProgressIndicator />)
            expect(screen.getByText('Step 0 of 3')).toBeInTheDocument()
        })
    })

    describe('data attributes', () => {
        it('sets data-step attribute to the current step', () => {
            render(<ProgressIndicator step={3} totalSteps={3} />)
            const container = document.querySelector('.progress-container')
            expect(container).toHaveAttribute('data-step', '3')
        })

        it('sets data-steps attribute to totalSteps', () => {
            render(<ProgressIndicator step={1} totalSteps={3} />)
            const container = document.querySelector('.progress-container')
            expect(container).toHaveAttribute('data-steps', '3')
        })

        it('reflects a custom totalSteps value in data-steps', () => {
            render(<ProgressIndicator step={2} totalSteps={6} />)
            const container = document.querySelector('.progress-container')
            expect(container).toHaveAttribute('data-steps', '6')
        })
    })

    describe('step clamping', () => {
        it('clamps step below 0 to 0', () => {
            render(<ProgressIndicator step={-5} totalSteps={3} />)
            expect(screen.getByText('Step 0 of 3')).toBeInTheDocument()
            const container = document.querySelector('.progress-container')
            expect(container).toHaveAttribute('data-step', '0')
        })

        it('clamps step above totalSteps to totalSteps', () => {
            render(<ProgressIndicator step={10} totalSteps={3} />)
            expect(screen.getByText('Step 3 of 3')).toBeInTheDocument()
            const container = document.querySelector('.progress-container')
            expect(container).toHaveAttribute('data-step', '3')
        })

        it('does not clamp a step that equals totalSteps', () => {
            render(<ProgressIndicator step={3} totalSteps={3} />)
            expect(screen.getByText('Step 3 of 3')).toBeInTheDocument()
        })

        it('does not clamp a step of 0', () => {
            render(<ProgressIndicator step={0} totalSteps={3} />)
            expect(screen.getByText('Step 0 of 3')).toBeInTheDocument()
        })
    })

    describe('all valid steps for the default 4-step form', () => {
        it.each([
            [0, '0'],
            [1, '1'],
            [2, '2'],
            [3, '3'],
            [4, '4'],
        ])('renders step %i correctly', (step, expectedDataStep) => {
            render(<ProgressIndicator step={step} totalSteps={4} />)
            expect(screen.getByText(`Step ${step} of 4`)).toBeInTheDocument()
            const container = document.querySelector('.progress-container')
            expect(container).toHaveAttribute('data-step', expectedDataStep)
        })
    })
})
