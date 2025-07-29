import type { ProjectFormData } from "../types/project";
import { formatDateTime } from "../utils/formatDateAndTime";

const ProjectDetailsSection = ({
    project,
}: {
    project: ProjectFormData | null;
}) => {
    if (!project) return <>Loading...</>;
    const { projectDetails, pipeDetails, manholeDetails } = project;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 m-4 space-y-6 border border-gray-200">
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Project Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span className="font-medium">Project Name:</span>{" "}
                        {projectDetails.projectName}
                    </div>
                    <div>
                        <span className="font-medium">Contractor Name:</span>{" "}
                        {projectDetails.contractorName}
                    </div>
                    <div>
                        <span className="font-medium">Inspector:</span>{" "}
                        {projectDetails.inspectorName}
                    </div>
                    <div>
                        <span className="font-medium">Date:</span>{" "}
                        {formatDateTime(
                            projectDetails.date,
                            projectDetails.time
                        )}
                    </div>
                    <div>
                        <span className="font-medium">Location:</span>{" "}
                        {projectDetails.location}
                    </div>
                    {projectDetails.slope && (
                        <div>
                            <span className="font-medium">Slope:</span>{" "}
                            {`${projectDetails.slope}%`}
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Pipe Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span className="font-medium">Pipe Diameter:</span>{" "}
                        {pipeDetails.pipeDiameter} mm
                    </div>
                    <div>
                        <span className="font-medium">Pipe Type:</span>{" "}
                        {pipeDetails.pipeType}
                    </div>
                    {pipeDetails.pipeLength && (
                        <div>
                            <span className="font-medium">Pipe Length:</span>{" "}
                            {pipeDetails.pipeLength} m
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Manhole Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <span className="font-medium">
                            Start Manhole Diameter:
                        </span>{" "}
                        {manholeDetails.startManhole} mm
                    </div>
                    <div>
                        <span className="font-medium">
                            End Manhole Diameter:
                        </span>{" "}
                        {manholeDetails.endManhole} mm
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsSection;
