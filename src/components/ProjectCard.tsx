import { useState } from "react";
import type { ProjectFormData } from "../types/project";
import { useNavigate } from "react-router-dom";
import EditProjectModal from "./EditProjectModal";
import { formatDateTime } from "../utils/formatDateAndTime";

const ProjectCard = ({ project }: { project: ProjectFormData }) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );
        if (!confirmDelete) return;

        const storedProjects = JSON.parse(
            localStorage.getItem("projects") || "[]"
        );
        const updatedProjects = storedProjects.filter(
            (p: ProjectFormData) => p.id !== project.id
        );

        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        window.location.reload();
    };

    const handleClick = () => {
        navigate(`/projects/${project.id}`);
    };

    

    return (
        <>
            <div
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100 relative"
                onClick={handleClick}
            >
                <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-blue-700 mb-3">
                                {project.projectDetails.projectName}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex">
                                    <span className="font-medium w-24">
                                        Contractor:
                                    </span>
                                    <span>
                                        {project.projectDetails.contractorName}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium w-24">
                                        Date:
                                    </span>
                                    <span>
                                        {formatDateTime(
                                            project.projectDetails.date,
                                            project.projectDetails.time
                                        )}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium w-24">
                                        Inspector:
                                    </span>
                                    <span>
                                        {project.projectDetails.inspectorName}
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="font-medium w-24">
                                        Location:
                                    </span>
                                    <span>
                                        {project.projectDetails.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex flex-row items-end gap-2 pt-1 z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-gray-500 hover:text-blue-600 transition"
                                title="Edit"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931ZM19.5 7.125 16.862 4.487M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={handleDelete}
                                className="text-gray-500 hover:text-red-600 transition"
                                title="Delete"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <EditProjectModal
                    project={project}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    );
};

export default ProjectCard;
