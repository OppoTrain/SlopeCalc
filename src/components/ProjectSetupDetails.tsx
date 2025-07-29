import type { ProjectFormData } from "../types/project";

const ProjectSetupDetails = ({ project }: { project: ProjectFormData }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 m-4 space-y-6 border border-gray-200">
            <div className="overflow-x-auto w-full">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-2 py-2 border">
                                Start Elevation
                            </th>
                            <th className="px-2 py-2 border">End Elevation</th>
                            <th className="px-2 py-2 border">Total Length</th>
                            <th className="px-2 py-2 border">Slope %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr key={project.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 border text-center">
                                {project.elevationsDetails?.startElevation?.toFixed(
                                    2
                                ) || "N/A"}
                            </td>
                            <td className="px-4 py-2 border text-center">
                                {project.elevationsDetails?.endElevation?.toFixed(
                                    2
                                ) || "N/A"}
                            </td>
                            <td className="px-4 py-2 border text-center">
                                {project.pipeDetails.pipeLength?.toFixed(2) ||
                                    "N/A"}
                            </td>
                            <td className="px-4 py-2 border text-center">
                                {project.projectDetails.slope || "N/A"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectSetupDetails;
