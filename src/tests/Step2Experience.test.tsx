import { yupResolver } from '@hookform/resolvers/yup'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import Step2Experience from '../steps/Step2Experience'
import {
    applicationSchema,
    type ApplicationFormData,
} from '../validation/applicationSchema'

interface WrapperProps {
    onNext?: () => void
    onBack?: () => void
    defaultValues?: Partial<ApplicationFormData>
}

const Wrapper = ({
    onNext = vi.fn(),
    onBack = vi.fn(),
    defaultValues = {},
}: WrapperProps) => {
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
            <Step2Experience onNext={onNext} onBack={onBack} />
        </FormProvider>
    )
}

describe('Step2Experience', () => {
    describe('rendering', () => {
        it('renders the "Experience & Education" heading', () => {
            render(<Wrapper />)
            expect(
                screen.getByText('Experience & Education')
            ).toBeInTheDocument()
        })

        it('renders Job Title label and input', () => {
            render(<Wrapper />)
            expect(screen.getByText('Job Title')).toBeInTheDocument()
            expect(
                screen.getByPlaceholderText('Frontend Developer')
            ).toBeInTheDocument()
        })

        it('renders Company Name label and input', () => {
            render(<Wrapper />)
            expect(screen.getByText('Company Name')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Acme Corp')).toBeInTheDocument()
        })

        it('renders Years of Experience label and input', () => {
            render(<Wrapper />)
            expect(screen.getByText('Years of Experience')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('2')).toBeInTheDocument()
        })

        it('renders Years of Experience as a number input', () => {
            render(<Wrapper />)
            expect(screen.getByPlaceholderText('2')).toHaveAttribute(
                'type',
                'number'
            )
        })

        it('renders Highest Degree Earned label and select', () => {
            render(<Wrapper />)
            expect(
                screen.getByText('Highest Degree Earned')
            ).toBeInTheDocument()
            expect(screen.getByRole('combobox')).toBeInTheDocument()
        })

        it('renders all degree options in the select', () => {
            render(<Wrapper />)
            const select = screen.getByRole('combobox')
            expect(select).toBeInTheDocument()
            expect(screen.getByText('Select degree...')).toBeInTheDocument()
            expect(screen.getByText('High School')).toBeInTheDocument()
            expect(screen.getByText('Bachelor\u2019s')).toBeInTheDocument()
            expect(screen.getByText('Master\u2019s')).toBeInTheDocument()
            expect(screen.getByText('PhD')).toBeInTheDocument()
        })

        it('renders the Back button', () => {
            render(<Wrapper />)
            expect(
                screen.getByRole('button', { name: /back/i })
            ).toBeInTheDocument()
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
                screen.queryByText('Job title is required')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByText('Company name is required')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByText('Years of experience is required')
            ).not.toBeInTheDocument()
            expect(
                screen.queryByText('Highest degree is required')
            ).not.toBeInTheDocument()
        })
    })

    describe('validation – empty form', () => {
        it('shows all required-field errors when Next is clicked with empty inputs', async () => {
            render(<Wrapper />)
            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(
                    screen.getByText('Job title is required')
                ).toBeInTheDocument()
                expect(
                    screen.getByText('Company name is required')
                ).toBeInTheDocument()

                expect(screen.getByText('Must be a number')).toBeInTheDocument()
                expect(
                    screen.getByText('Highest degree is required')
                ).toBeInTheDocument()
            })
        })

        it('does not call onNext when the form is invalid', async () => {
            const onNext = vi.fn()
            render(<Wrapper onNext={onNext} />)
            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Job title is required'))
            expect(onNext).not.toHaveBeenCalled()
        })
    })

    describe('validation – individual fields', () => {
        it('shows "Must be a number" error when a non-numeric value is typed in Years of Experience', async () => {
            render(<Wrapper />)
            const yearsInput = screen.getByPlaceholderText('2')
            await userEvent.type(yearsInput, 'abc')
            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(screen.getByText('Must be a number')).toBeInTheDocument()
            })
        })

        it('shows "Invalid number" error when years of experience is negative', async () => {
            render(<Wrapper />)
            const yearsInput = screen.getByPlaceholderText('2')
            await userEvent.type(yearsInput, '-1')
            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(screen.getByText('Invalid number')).toBeInTheDocument()
            })
        })

        it('clears the job title error once the user types a valid value and blurs', async () => {
            render(<Wrapper />)

            await userEvent.click(screen.getByRole('button', { name: /next/i }))
            await waitFor(() => screen.getByText('Job title is required'))

            const jobTitleInput =
                screen.getByPlaceholderText('Frontend Developer')
            await userEvent.type(jobTitleInput, 'Software Engineer')
            await userEvent.tab()

            await waitFor(() => {
                expect(
                    screen.queryByText('Job title is required')
                ).not.toBeInTheDocument()
            })
        })
    })

    describe('navigation', () => {
        it('calls onBack when the Back button is clicked', async () => {
            const onBack = vi.fn()
            render(<Wrapper onBack={onBack} />)
            await userEvent.click(screen.getByRole('button', { name: /back/i }))
            expect(onBack).toHaveBeenCalledTimes(1)
        })

        it('does not call onNext when Back is clicked', async () => {
            const onNext = vi.fn()
            render(<Wrapper onNext={onNext} />)
            await userEvent.click(screen.getByRole('button', { name: /back/i }))
            expect(onNext).not.toHaveBeenCalled()
        })
    })

    describe('successful submission', () => {
        it('calls onNext when all fields are valid', async () => {
            const onNext = vi.fn()
            render(<Wrapper onNext={onNext} />)

            await userEvent.type(
                screen.getByPlaceholderText('Frontend Developer'),
                'Software Engineer'
            )
            await userEvent.type(
                screen.getByPlaceholderText('Acme Corp'),
                'Tech Inc'
            )
            await userEvent.type(screen.getByPlaceholderText('2'), '5')
            await userEvent.selectOptions(
                screen.getByRole('combobox'),
                'Bachelor'
            )

            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => expect(onNext).toHaveBeenCalledTimes(1))
        })

        it('does not show any validation errors after a valid submission', async () => {
            render(
                <Wrapper
                    defaultValues={{
                        jobTitle: 'Software Engineer',
                        companyName: 'Tech Inc',
                        yearsOfExperience: 5,
                        highestDegree: 'Bachelor',
                    }}
                />
            )

            await userEvent.click(screen.getByRole('button', { name: /next/i }))

            await waitFor(() => {
                expect(
                    screen.queryByText('Job title is required')
                ).not.toBeInTheDocument()
                expect(
                    screen.queryByText('Company name is required')
                ).not.toBeInTheDocument()
                expect(
                    screen.queryByText('Years of experience is required')
                ).not.toBeInTheDocument()
                expect(
                    screen.queryByText('Highest degree is required')
                ).not.toBeInTheDocument()
            })
        })
    })

    describe('default values', () => {
        it('pre-fills inputs when defaultValues are provided', () => {
            render(
                <Wrapper
                    defaultValues={{
                        jobTitle: 'DevOps Engineer',
                        companyName: 'Cloud Corp',
                        yearsOfExperience: 3,
                        highestDegree: 'Master',
                    }}
                />
            )

            expect(
                screen.getByPlaceholderText('Frontend Developer')
            ).toHaveValue('DevOps Engineer')
            expect(screen.getByPlaceholderText('Acme Corp')).toHaveValue(
                'Cloud Corp'
            )
            expect(screen.getByPlaceholderText('2')).toHaveValue(3)
            expect(screen.getByRole('combobox')).toHaveValue('Master')
        })
    })
})
