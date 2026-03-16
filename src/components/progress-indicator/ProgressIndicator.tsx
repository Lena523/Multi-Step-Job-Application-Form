import type { ProgressProps } from '../../types'
import './progress.css'

export const ProgressIndicator = ({
    step = 0,
    totalSteps = 3,
}: ProgressProps) => {
    const s = Math.max(0, Math.min(step, totalSteps))

    return (
        <div className="mb-6">
            <p className="text-center text-sm font-medium mb-2">
                Step {s} of {totalSteps}
            </p>

            <div
                className="progress-container w-full bg-gray-200 h-2 rounded-full overflow-hidden"
                data-steps={totalSteps}
                data-step={s}
            >
                <div className="progress-fill" />
            </div>
        </div>
    )
}
