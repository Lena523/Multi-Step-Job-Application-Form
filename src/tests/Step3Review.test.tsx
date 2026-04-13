import { yupResolver } from '@hookform/resolvers/yup'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import Step3Review from '../steps/Step3Review'
import {
    applicationSchema,
    type ApplicationFormData,
} from '../validation/applicationSchema'

const defaultValidValues: ApplicationFormData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '1234567890',
    city: 'New York',
    jobTitle: 'Software Engineer',
    companyName: 'Tech Inc',
    yearsOfExperience: 5,
    highestDegree: 'Bachelor',
}

interface WrapperProps {
    onBack?: () => void
    onSubmitSuccess?: () => void
    defaultValues?: Partial<ApplicationFormData>
}

const Wrapper = ({
    onBack = vi.fn(),
    onSubmitSuccess = vi.fn(),
    defaultValues = {},
}: WrapperProps) => {
    const methods = useForm<ApplicationFormData>({
        resolver: yupResolver(applicationSchema),
        defaultValues: {
            ...defaultValidValues,
            ...defaultValues,
        },
        mode: 'onTouched',
    })

    return (
        <FormProvider {...methods}>
            <Step3Review onBack={onBack} onSubmitSuccess={onSubmitSuccess} />
        </FormProvider>
    )
}

describe('Step3Review', () => {
    describe('rendering', () => {
        it('renders the "Review Your Information" heading', () => {
            render(<Wrapper />)
            expect(
                screen.getByText('Review Your Information')
            ).toBeInTheDocument()
        })

        it('renders the "Personal Information" section heading', () => {
            render(<Wrapper />)
            expect(screen.getByText('Personal Information')).toBeInTheDocument()
        })

        it('renders the "Experience & Education" section heading', () => {
            render(<Wrapper />)
            expect(
                screen.getByText('Experience & Education')
            ).toBeInTheDocument()
        })

        it('renders the Back button', () => {
            render(<Wrapper />)
            expect(
                screen.getByRole('button', { name: /back/i })
            ).toBeInTheDocument()
        })

        it('renders the Submit button', () => {
            render(<Wrapper />)
            expect(
                screen.getByRole('button', { name: /submit/i })
            ).toBeInTheDocument()
        })
    })

    describe('data display', () => {
        it('displays the name from form data', () => {
            render(<Wrapper />)
            expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
        })

        it('displays the email from form data', () => {
            render(<Wrapper />)
            expect(screen.getByText(/jane@example\.com/)).toBeInTheDocument()
        })

        it('displays the phone from form data', () => {
            render(<Wrapper />)
            expect(screen.getByText(/1234567890/)).toBeInTheDocument()
        })

        it('displays the city from form data', () => {
            render(<Wrapper />)
            expect(screen.getByText(/New York/)).toBeInTheDocument()
        })

        it('displays the job title from form data', () => {
            render(<Wrapper />)
            expect(screen.getByText(/Software Engineer/)).toBeInTheDocument()
        })

        it('displays the company name from form data', () => {
            render(<Wrapper />)
            expect(screen.getByText(/Tech Inc/)).toBeInTheDocument()
        })

        it('displays the years of experience from form data', () => {
            render(<Wrapper />)
            expect(screen.getByText('Years of Experience:')).toBeInTheDocument()
            const yearsRow = screen
                .getByText('Years of Experience:')
                .closest('p')
            expect(yearsRow).toHaveTextContent('5')
        })

        it('displays the highest degree from form data', () => {
            render(<Wrapper />)
            expect(screen.getByText(/Bachelor/)).toBeInTheDocument()
        })

        it('renders the Name label', () => {
            render(<Wrapper />)
            expect(screen.getByText('Name:')).toBeInTheDocument()
        })

        it('renders the Email label', () => {
            render(<Wrapper />)
            expect(screen.getByText('Email:')).toBeInTheDocument()
        })

        it('renders the Phone label', () => {
            render(<Wrapper />)
            expect(screen.getByText('Phone:')).toBeInTheDocument()
        })

        it('renders the City label', () => {
            render(<Wrapper />)
            expect(screen.getByText('City:')).toBeInTheDocument()
        })

        it('renders the Job Title label', () => {
            render(<Wrapper />)
            expect(screen.getByText('Job Title:')).toBeInTheDocument()
        })

        it('renders the Company Name label', () => {
            render(<Wrapper />)
            expect(screen.getByText('Company Name:')).toBeInTheDocument()
        })

        it('renders the Years of Experience label', () => {
            render(<Wrapper />)
            expect(screen.getByText('Years of Experience:')).toBeInTheDocument()
        })

        it('renders the Highest Degree label', () => {
            render(<Wrapper />)
            expect(screen.getByText('Highest Degree:')).toBeInTheDocument()
        })

        it('displays different data when custom defaultValues are provided', () => {
            render(
                <Wrapper
                    defaultValues={{
                        name: 'John Smith',
                        email: 'john@test.com',
                        city: 'Boston',
                        jobTitle: 'DevOps Engineer',
                        companyName: 'Cloud Corp',
                        yearsOfExperience: 10,
                        highestDegree: 'Master',
                    }}
                />
            )

            expect(screen.getByText(/John Smith/)).toBeInTheDocument()
            expect(screen.getByText(/john@test\.com/)).toBeInTheDocument()
            expect(screen.getByText(/Boston/)).toBeInTheDocument()
            expect(screen.getByText(/DevOps Engineer/)).toBeInTheDocument()
            expect(screen.getByText(/Cloud Corp/)).toBeInTheDocument()
            expect(screen.getByText(/Master/)).toBeInTheDocument()
        })
    })

    describe('navigation', () => {
        it('calls onBack when the Back button is clicked', async () => {
            const onBack = vi.fn()
            render(<Wrapper onBack={onBack} />)
            await userEvent.click(screen.getByRole('button', { name: /back/i }))
            expect(onBack).toHaveBeenCalledTimes(1)
        })

        it('does not call onSubmitSuccess when the Back button is clicked', async () => {
            const onSubmitSuccess = vi.fn()
            render(<Wrapper onSubmitSuccess={onSubmitSuccess} />)
            await userEvent.click(screen.getByRole('button', { name: /back/i }))
            expect(onSubmitSuccess).not.toHaveBeenCalled()
        })

        it('does not call onBack when the Submit button is clicked', async () => {
            const onBack = vi.fn()
            render(<Wrapper onBack={onBack} />)
            await userEvent.click(
                screen.getByRole('button', { name: /submit/i })
            )
            expect(onBack).not.toHaveBeenCalled()
        })
    })

    describe('submission', () => {
        it('calls onSubmitSuccess when Submit is clicked with valid data', async () => {
            const onSubmitSuccess = vi.fn()
            render(<Wrapper onSubmitSuccess={onSubmitSuccess} />)
            await userEvent.click(
                screen.getByRole('button', { name: /submit/i })
            )
            await waitFor(() =>
                expect(onSubmitSuccess).toHaveBeenCalledTimes(1)
            )
        })

        it('does not call onSubmitSuccess when form data is invalid', async () => {
            const onSubmitSuccess = vi.fn()
            render(
                <Wrapper
                    onSubmitSuccess={onSubmitSuccess}
                    defaultValues={{
                        name: '',
                        email: 'not-an-email',
                        phone: '',
                    }}
                />
            )
            await userEvent.click(
                screen.getByRole('button', { name: /submit/i })
            )
            await waitFor(() => expect(onSubmitSuccess).not.toHaveBeenCalled())
        })
    })
})
