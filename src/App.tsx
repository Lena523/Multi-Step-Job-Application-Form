import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'

import { ProgressIndicator } from './components/progress-indicator/ProgressIndicator'
import { useFormPersist } from './hooks/useFormPersist'
import StarterPage from './steps/StarterPage'
import Step1PersonalInfo from './steps/Step1PersonalInfo'
import Step2Experience from './steps/Step2Experience'
import Step3Review from './steps/Step3Review'
import Step4SuccessPage from './steps/Step4SuccessPage'
import { applicationSchema } from './validation/applicationSchema'

import type { ApplicationFormData } from './validation/applicationSchema'

const App = () => {
    const methods = useForm<ApplicationFormData>({
        resolver: yupResolver(applicationSchema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            city: '',
            jobTitle: '',
            companyName: '',
            yearsOfExperience: undefined,
            highestDegree: '',
        },
    })

    useFormPersist(methods)

    const [step, setStep] = useState(() => {
        const storedStep = localStorage.getItem('jobApplicationStep')
        return storedStep ? Number(storedStep) : 0
    })

    const next = () => {
        setStep((step) => {
            const newStep = step + 1
            localStorage.setItem('jobApplicationStep', String(newStep))
            return newStep
        })
    }

    const back = () => {
        setStep((step) => {
            const newStep = step - 1
            localStorage.setItem('jobApplicationStep', String(newStep))
            return newStep
        })
    }

    const handleClose = () => {
        localStorage.removeItem('jobApplicationData')
        localStorage.removeItem('jobApplicationStep')
        methods.reset()
        setStep(0)
    }

    return (
        <FormProvider {...methods}>
            <div className="mx-auto max-w-md p-4">
                {step === 0 && <StarterPage onStart={next} />}
                {step >= 1 && <ProgressIndicator step={step} />}
                {step === 1 && <Step1PersonalInfo onNext={next} />}
                {step === 2 && <Step2Experience onNext={next} onBack={back} />}
                {step === 3 && (
                    <Step3Review
                        onBack={back}
                        onSubmitSuccess={() => setStep(4)}
                    />
                )}
                {step === 4 && <Step4SuccessPage onClose={handleClose} />}
            </div>
        </FormProvider>
    )
}

export default App
