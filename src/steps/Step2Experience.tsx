import { useFormContext } from 'react-hook-form'

import type { Step2Props } from '../types'
import type { ApplicationFormData } from '../validation/applicationSchema'

const Step2Experience = ({ onNext, onBack }: Step2Props) => {
    const {
        register,
        trigger,
        formState: { errors },
    } = useFormContext<ApplicationFormData>()

    const handleNext = async () => {
        const valid = await trigger([
            'jobTitle',
            'companyName',
            'yearsOfExperience',
            'highestDegree',
        ])

        if (valid) onNext()
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">
                Experience & Education
            </h2>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Job Title
                </label>
                <input
                    {...register('jobTitle')}
                    placeholder="Frontend Developer"
                    className="w-full p-3 border rounded-lg"
                />
                {errors.jobTitle && (
                    <p className="text-sm text-red-500">
                        {errors.jobTitle.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Company Name
                </label>
                <input
                    {...register('companyName')}
                    placeholder="Acme Corp"
                    className="w-full p-3 border rounded-lg"
                />
                {errors.companyName && (
                    <p className="text-sm text-red-500">
                        {errors.companyName.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Years of Experience
                </label>
                <input
                    type="number"
                    {...register('yearsOfExperience')}
                    placeholder="2"
                    className="w-full p-3 border rounded-lg"
                />
                {errors.yearsOfExperience && (
                    <p className="text-sm text-red-500">
                        {errors.yearsOfExperience.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Highest Degree Earned
                </label>
                <select
                    {...register('highestDegree')}
                    className="w-full p-3 border rounded-lg bg-white"
                >
                    <option value="">Select degree...</option>
                    <option value="High School">High School</option>
                    <option value="Bachelor">Bachelor’s</option>
                    <option value="Master">Master’s</option>
                    <option value="PhD">PhD</option>
                </select>
                {errors.highestDegree && (
                    <p className="text-sm text-red-500">
                        {errors.highestDegree.message}
                    </p>
                )}
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={onBack}
                    className="w-1/2 bg-gray-300 text-black py-3 rounded-lg"
                >
                    Back
                </button>

                <button
                    onClick={handleNext}
                    className="w-1/2 bg-blue-600 text-white py-3 rounded-lg"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Step2Experience
