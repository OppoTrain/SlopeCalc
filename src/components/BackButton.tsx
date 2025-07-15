import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center">
            <div className="mx-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-[#5AB8C8] hover:text-[#499cac] text-sm font-medium px-3 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-4 w-4 mr-1"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                    </svg>
                    Back
                </button>
            </div>
        </div>
    );
};

export default BackButton;
