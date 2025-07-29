import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type ProjectFormData } from "../types/project";
import ProjectDetailsSection from "../components/ProjectDetails";
import ConnectorsList from "../components/ConnectorsList";
import BackButton from "../components/BackButton";
import { processPDF } from "../utils/pdfExporter";
import CameraBtn from "../components/CameraBtn";
import ProjectSetupDetails from "../components/ProjectSetupDetails";

const Review = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<ProjectFormData | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    useEffect(() => {
        const storedProjects = JSON.parse(
            localStorage.getItem("projects") || "[]"
        );
        const currentProject: ProjectFormData = storedProjects.find(
            (p: ProjectFormData) => p.id === id
        );
        setProject(currentProject || null);
    }, [id]);

    const handlePDFExport = async () => {
        if (!project) {
            alert("Project data is not available.");
            return;
        }

        setIsExporting(true);
        setExportSuccess(false);
        try {
            await processPDF(project);
            setExportSuccess(true);
        } catch (error) {
            console.error("Error exporting PDF:", error);
            alert("Failed to export PDF. Please try again.");
        } finally {
            setIsExporting(false);
            setTimeout(() => setExportSuccess(false), 3000); // Reset after 3s
        }
    };

    if (!project) return <div className="m-4">Loading project...</div>;

    const connectors = project.connectors || [];

    return (
        <>
            <div className="flex justify-between items-center mt-4 mx-4">
                <BackButton />
                <CameraBtn id={project.id ?? "0"} />
            </div>

            <div className="mx-4 space-y-4 mt-6">
                <button
                    className={`w-full ${
                        isExporting
                            ? "bg-gray-500"
                            : "bg-green-600 hover:bg-green-700"
                    } text-white font-semibold px-6 py-2 rounded-xl transition flex justify-center items-center`}
                    onClick={handlePDFExport}
                    disabled={isExporting}
                >
                    {isExporting ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 mr-2 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                            Exporting...
                        </>
                    ) : (
                        "Export to PDF"
                    )}
                </button>

                {exportSuccess && (
                    <div className="text-green-600 font-medium transition-all duration-300">
                        ✅ PDF exported successfully!
                    </div>
                )}
            </div>

            <ProjectDetailsSection project={project} />
            <ProjectSetupDetails project={project} />
            <ConnectorsList connectors={connectors} />

            <div className="flex justify-end mx-4 mb-4">
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
