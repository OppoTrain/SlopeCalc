import type { ProjectFormData } from "../types/project";

const ConnectorsList = ({
    connectors,
    onDelete,
}: {
    connectors: ProjectFormData["connectors"];
    onDelete: (jointNumber: number) => void;
}) => {
    if (!connectors || connectors.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 m-4 border border-gray-200">
                <div className="mb-2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                        Connector Summary
                    </h2>
                    <p className="text-gray-500 text-sm">
                        No connectors added yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 m-4 space-y-6 border border-gray-200">
            <div className="overflow-x-auto w-full">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-4 py-2 border">Joint #</th>
                            <th className="px-4 py-2 border">Distance (m)</th>
                            <th className="px-4 py-2 border">Drop (m)</th>
                            <th className="px-4 py-2 border">
                                Theoretical (m)
                            </th>
                            <th className="px-4 py-2 border">Actual (m)</th>
                            <th className="px-4 py-2 border">Diff (m)</th>
                            <th className="px-4 py-2 border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {connectors?.map((c) => (
                            <tr
                                key={c.jointNumber}
                                className="hover:bg-gray-50"
                            >
                                <td className="px-4 py-2 border text-center">
                                    {c.jointNumber}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                    {c.distance?.toFixed(2)}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                    {c.elevationDrop?.toFixed(4)}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                    {c.theoreticalElevation?.toFixed(3)}
                                </td>
                                <td className="px-4 py-2 border text-center">
                                    {c.actualElevation?.toFixed(3)}
                                </td>
                                <td
                                    className={`px-4 py-2 border text-center ${
                                        (c.difference ?? 0) > 0
                                            ? "text-green-600"
                                            : (c.difference ?? 0) < 0
                                            ? "text-red-600"
                                            : ""
                                    }`}
                                >
                                    {c.difference?.toFixed(4)}
                                </td>

                                <td className="px-4 py-2 border text-center">
                                    <button
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    "Are you sure you want to delete this connector?"
                                                )
                                            ) {
                                                onDelete(c.jointNumber ?? 0);
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                        aria-label="Delete"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 inline"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConnectorsList;
