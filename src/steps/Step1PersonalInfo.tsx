import { useFormContext } from 'react-hook-form'

import type { Step1Props } from '../types'
import type { ApplicationFormData } from '../validation/applicationSchema'

const Step1PersonalInfo = ({ onNext }: Step1Props) => {
    const {
        register,
        trigger,
        formState: { errors },
    } = useFormContext<ApplicationFormData>()

    const handleNext = async () => {
        const valid = await trigger(['name', 'email', 'phone', 'city'])
        if (valid) onNext()
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-center">
                Personal Information
            </h2>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Full Name
                </label>
                <input
                    {...register('name')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="John Doe"
                />
                {errors.name && (
                    <p className="text-sm text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                    {...register('email')}
                    type="email"
                    className="w-full p-3 border rounded-lg"
                    placeholder="example@gmail.com"
                />
                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Phone Number
                </label>
                <input
                    {...register('phone')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="+375 29 123 45 67"
                />
                {errors.phone && (
                    <p className="text-sm text-red-500">
                        {errors.phone.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                    {...register('city')}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Minsk"
                />
                {errors.city && (
                    <p className="text-sm text-red-500">
                        {errors.city.message}
                    </p>
                )}
            </div>

            <button
                onClick={handleNext}
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
                Next
            </button>
        </div>
    )
}

export default Step1PersonalInfo
