interface StarterPageProps {
    onStart: () => void
}

const StarterPage = ({ onStart }: StarterPageProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-blue-600 tracking-tight">
                    Job Application
                </h1>
                <p className="text-gray-500 text-base">
                    Fill out the form to apply for your next opportunity.
                </p>
            </div>

            <button
                onClick={onStart}
                className="px-10 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 shadow-md cursor-pointer"
            >
                START
            </button>
        </div>
    )
}

export default StarterPage
