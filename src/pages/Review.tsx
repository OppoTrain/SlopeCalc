import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type ProjectFormData } from "../types/project";
import ProjectDetailsSection from "../components/ProjectDetails";
import ConnectorsList from "../components/ConnectorsList";
import BackButton from "../components/BackButton";

const Review = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectFormData | null>(null);

    useEffect(() => {
        const storedProjects = JSON.parse(
            localStorage.getItem("projects") || "[]"
        );
        const currentProject: ProjectFormData = storedProjects.find(
            (p: ProjectFormData) => p.id === id
        );
        setProject(currentProject || null);
    }, [id]);

    if (!project) return <div>Loading project...</div>;

    const connectors = project.connectors || [];

    return (
        <>
            <BackButton />
            <div className="flex justify-between mx-4 space-x-4 mt-6">
                <button
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl transition"
                    onClick={() => {
                        window.confirm("Export to PDF clicked");
                    }}
                >
                    Export to PDF
                </button>
                <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-xl transition"
                    onClick={() => {
                        window.confirm("Export to Excel clicked");
                    }}
                >
                    Export to Excel
                </button>
            </div>
            <ProjectDetailsSection project={project} />

            <ConnectorsList
                connectors={connectors}
                onDelete={(jointNumber) => {
                    const updatedConnectors = connectors
                        .filter((c) => c.jointNumber !== jointNumber)
                        .map((c, index) => ({
                            ...c,
                            jointNumber: index + 1,
                        }));
                    const updatedProject = {
                        ...project,
                        connectors: updatedConnectors,
                    };
                    setProject(updatedProject);
                    localStorage.setItem(
                        "projects",
                        JSON.stringify(
                            JSON.parse(
                                localStorage.getItem("projects") || "[]"
                            ).map((p: { id: string | undefined }) =>
                                p.id === id ? updatedProject : p
                            )
                        )
                    );
                }}
            />

            <div className="flex justify-end mx-4">
                <button
                    onClick={() => navigate(`/`)}
                    className="bg-[#5AB8C8] hover:bg-[#499cac] text-white font-semibold px-6 py-2 rounded-xl transition"
                >
                    Back to Projects
                </button>
            </div>
        </>
    );
};

export default Review;
