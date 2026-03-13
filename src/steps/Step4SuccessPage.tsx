import type { Step4Props } from '../types'

const Step4SuccessPage = ({ onClose }: Step4Props) => {
    return (
        <div className="text-center p-8 space-y-4">
            <h2 className="text-2xl font-bold">Application Submitted 🎉</h2>
            <p className="text-gray-600">
                Thank you! Your job application has been successfully submitted.
            </p>
            <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
            >
                CLOSE
            </button>
        </div>
    )
}

export default Step4SuccessPage
