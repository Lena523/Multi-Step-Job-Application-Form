import { useFormContext } from 'react-hook-form'

import type { Step3Props } from '../types'
import type { ApplicationFormData } from '../validation/applicationSchema'

const Step3Review = ({ onBack, onSubmitSuccess }: Step3Props) => {
    const { getValues, trigger } = useFormContext<ApplicationFormData>()
    const data = getValues()

    const handleSubmit = async () => {
        const valid = await trigger()

        if (valid) {
            onSubmitSuccess()
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">
                Review Your Information
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-700">
                        Personal Information
                    </h3>
                    <p>
                        <span className="font-medium">Name:</span> {data.name}
                    </p>
                    <p>
                        <span className="font-medium">Email:</span> {data.email}
                    </p>
                    <p>
                        <span className="font-medium">Phone:</span> {data.phone}
                    </p>
                    <p>
                        <span className="font-medium">City:</span> {data.city}
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-700">
                        Experience & Education
                    </h3>
                    <p>
                        <span className="font-medium">Job Title:</span>{' '}
                        {data.jobTitle}
                    </p>
                    <p>
                        <span className="font-medium">Company Name:</span>{' '}
                        {data.companyName}
                    </p>
                    <p>
                        <span className="font-medium">
                            Years of Experience:
                        </span>{' '}
                        {data.yearsOfExperience}
                    </p>
                    <p>
                        <span className="font-medium">Highest Degree:</span>{' '}
                        {data.highestDegree}
                    </p>
                </div>
            </div>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={onBack}
                    className="w-1/2 bg-gray-300 text-black py-3 rounded-lg"
                >
                    Back
                </button>

                <button
                    onClick={handleSubmit}
                    className="w-1/2 bg-green-600 text-white py-3 rounded-lg"
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default Step3Review
