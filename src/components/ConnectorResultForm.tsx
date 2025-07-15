import type { ConnectorType } from "../types/connectors.types";

const ConnectorResultForm = ({ result }: { result: ConnectorType }) => {
    if (!result) return null;

    const getAdjustmentMessage = () => {
        if (result.difference > 0) return "Move Down";
        if (result.difference < 0) return "Move Up";
        return "No adjustment needed";
    };

    return (
        <div className="border border-blue-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-700">
                Field Reading Comparison
            </h3>

            <div className="grid grid-cols-3 text-center text-sm font-medium">
                <div>Theoretical</div>
                <div>Actual</div>
                <div>Difference</div>
            </div>

            <div className="grid grid-cols-3 text-center mb-2">
                <div>{result.theoreticalElevation} m</div>
                <div>{result.actualElevation} m</div>
                <div
                    className={`${
                        result.difference > 0
                            ? "text-green-600"
                            : result.difference < 0
                            ? "text-red-600"
                            : "text-gray-600"
                    }`}
                >
                    {result.difference > 0 ? "+" : ""}
                    {result.difference.toFixed(3)} m
                </div>
            </div>

            <div className="text-center text-sm font-semibold text-blue-600">
                {getAdjustmentMessage()}
            </div>
        </div>
    );
};

export default ConnectorResultForm;
