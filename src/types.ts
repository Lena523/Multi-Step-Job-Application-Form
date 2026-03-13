export interface Step1Props {
    onNext: () => void
}

export interface Step2Props {
    onNext: () => void
    onBack: () => void
}

export interface Step3Props {
    onBack: () => void
    onSubmitSuccess: () => void
}

export interface Step4Props {
    onClose: () => void
}

export interface ProgressProps {
    step: number
    totalSteps?: number
}
