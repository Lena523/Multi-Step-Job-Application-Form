import * as yup from 'yup'

export const applicationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup
        .string()
        .min(6, 'Too short')
        .required('Phone number is required'),
    city: yup.string().required('City is required'),

    jobTitle: yup.string().required('Job title is required'),
    companyName: yup.string().required('Company name is required'),
    yearsOfExperience: yup
        .number()
        .typeError('Must be a number')
        .min(1, 'Invalid number')
        .max(50, 'At most - 50')
        .required('Years of experience is required'),
    highestDegree: yup.string().required('Highest degree is required'),
})

export type ApplicationFormData = yup.InferType<typeof applicationSchema>
