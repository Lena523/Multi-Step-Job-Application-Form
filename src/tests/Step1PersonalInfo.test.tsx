import { yupResolver } from '@hookform/resolvers/yup'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import Step1PersonalInfo from '../steps/Step1PersonalInfo'
import {
    applicationSchema,
    type ApplicationFormData,
} from '../validation/applicationSchema'

interface WrapperProps {
    onNext?: () => void
    defaultValues?: Partial<ApplicationFormData>
}

const Wrapper = ({ onNext = vi.fn(), defaultValues = {} }: WrapperProps) => {
    const methods = useForm<ApplicationFormData>({
        resolver: yupResolver(applicationSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            city: '',
            jobTitle: '',
            companyName: '',
            yearsOfExperience: undefined,
            highestDegree: '',
            ...defaultValues,
        },
        mode: 'onTouched',
    })

    return (
        <FormProvider {...methods}>
            <Step1PersonalInfo onNext={onNext} />
        </FormProvider>
    )
}

describe('Step1PersonalInfo', () => {
    describe('rendering', () => {
        it('renders the "Personal Information" heading', () => {
            render(<Wrapper />)
            expect(screen.getByText('Personal Information')).toBeInTheDocument()
        })

        it('renders Full Name label and input', () => {
            render(<Wrapper />)
            expect(screen.getByText('Full Name')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
        })

        it('renders Email label and input', () => {
            render(<Wrapper />)
            expect(screen.getByText('Email')).toBeInTheDocument()
            expect(
                screen.getByPlaceholderText('example@gmail.com')
            ).toBeInTheDocument()
        })

        it('renders Phone Number label and input', () => {
            render(<Wrapper />)
            expect(screen.getByText('Phone Number')).toBeInTheDocument()
            expect(
                screen.getByPlaceholderText('+375 29 123 45 67')
            ).toBeInTheDocument()
        })

        it('renders City label and input', () => {
            render(<Wrapper />)
            expect(screen.getByText('City')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Minsk')).toBeInTheDocument()
        })

        it('renders the Next button', () => {
            render(<Wrapper />)
            expect(
                screen.getByRole('button', { name: /next/i })
            ).toBeInTheDocument()
        })

        it('does not show validation errors on initial render', () => {
            render(<Wrapper />)
            expect(
                screen.queryByText('Name is required')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByText('Email is required')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByText('Phone number is required')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByText('City is required')
            ).not.toBeInTheDocument()
        })
    })

    describe('validation – empty form', () => {
        it('shows all required-field errors when Next is clicked with empty inputs', async () => {
            render(<Wrapper />)
            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(screen.getByText('Name is required')).toBeInTheDocument()
                expect(
                    screen.getByText('Email is required')
                ).toBeInTheDocument()

                expect(screen.getByText('Too short')).toBeInTheDocument()
                expect(screen.getByText('City is required')).toBeInTheDocument()
            })
        })

        it('does not call onNext when the form is invalid', async () => {
            const onNext = vi.fn()
            render(<Wrapper onNext={onNext} />)
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Name is required'))
            expect(onNext).not.toHaveBeenCalled()
        })
    })

    describe('validation – individual fields', () => {
        it('shows "Invalid email" error for a malformed email address', async () => {
            render(<Wrapper />)
            await userEvent.type(
                screen.getByPlaceholderText('example@gmail.com'),
                'not-an-email'
            )
            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(screen.getByText('Invalid email')).toBeInTheDocument()
            })
        })

        it('shows "Too short" error for a phone number that is too short', async () => {
            render(<Wrapper />)
            await userEvent.type(
                screen.getByPlaceholderText('+375 29 123 45 67'),
                '123'
            )
            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(screen.getByText('Too short')).toBeInTheDocument()
            })
        })

        it('clears the name error once the user types a valid name and blurs', async () => {
            render(<Wrapper />)

            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Name is required'))

            const nameInput = screen.getByPlaceholderText('John Doe')
            await userEvent.type(nameInput, 'Jane Smith')
            await userEvent.tab()

            await waitFor(() => {
                expect(
                    screen.queryByText('Name is required')
                ).not.toBeInTheDocument()
            })
        })
    })

    describe('successful submission', () => {
        it('calls onNext when all fields are valid', async () => {
            const onNext = vi.fn()
            render(<Wrapper onNext={onNext} />)

            await userEvent.type(
                screen.getByPlaceholderText('John Doe'),
                'Jane Smith'
            )
            await userEvent.type(
                screen.getByPlaceholderText('example@gmail.com'),
                'jane@example.com'
            )
            await userEvent.type(
                screen.getByPlaceholderText('+375 29 123 45 67'),
                '+375291234567'
            )
            await userEvent.type(screen.getByPlaceholderText('Minsk'), 'Minsk')

            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
        })

        it('does not show any validation errors after a valid submission', async () => {
            render(
                <Wrapper
                    defaultValues={{
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                        phone: '+375291234567',
                        city: 'Minsk',
                    }}
                />
            )

            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(
                    screen.queryByText('Name is required')
                ).not.toBeInTheDocument()
                expect(
                    screen.queryByText('Email is required')
                ).not.toBeInTheDocument()
                expect(
                    screen.queryByText('Phone number is required')
                ).not.toBeInTheDocument()
                expect(
                    screen.queryByText('City is required')
                ).not.toBeInTheDocument()
            })
        })
    })

    describe('default values', () => {
        it('pre-fills inputs when defaultValues are provided', () => {
            render(
                <Wrapper
                    defaultValues={{
                        name: 'Alice',
                        email: 'alice@example.com',
                        phone: '+375291112233',
                        city: 'Grodno',
                    }}
                />
            )

            expect(screen.getByPlaceholderText('John Doe')).toHaveValue('Alice')
            expect(
                screen.getByPlaceholderText('example@gmail.com')
            ).toHaveValue('alice@example.com')
            expect(
                screen.getByPlaceholderText('+375 29 123 45 67')
            ).toHaveValue('+375291112233')
            expect(screen.getByPlaceholderText('Minsk')).toHaveValue('Grodno')
        })
    })
})
