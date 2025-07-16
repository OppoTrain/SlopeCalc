import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { type ProjectFormData } from "../types/project";
import ProjectDetailsSection from "../components/ProjectDetails";
import ConnectorsList from "../components/ConnectorsList";
import BackButton from "../components/BackButton";
import ConnectorResultForm from "../components/ConnectorResultForm";
import type { ConnectorType } from "../types/connectors.types";
import CameraBtn from "../components/CameraBtn";

const Connectors = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState<ProjectFormData | null>(null);
    const [connectors, setConnectors] = useState<ProjectFormData["connectors"]>(
        []
    );
    const [jointDistance, setJointDistance] = useState<string>("");
    const [actualHeight, setActualHeight] = useState<string>("");
    const [result, setResult] = useState<ConnectorType | null>(null);

    useEffect(() => {
        const storedProjects = JSON.parse(
            localStorage.getItem("projects") || "[]"
        );
        const currentProject: ProjectFormData = storedProjects.find(
            (p: ProjectFormData) => p.id === id
        );

        if (currentProject) {
            setProject(currentProject);
            setConnectors(currentProject.connectors || []);
        }
    }, [id]);

    const updateProjectInStorage = (updatedProject: ProjectFormData) => {
        const stored = JSON.parse(localStorage.getItem("projects") || "[]");
        const updated = stored.map((p: ProjectFormData) =>
            p.id === updatedProject.id ? updatedProject : p
        );
        localStorage.setItem("projects", JSON.stringify(updated));
    };

    const handleCalculate = () => {
        if (!project || !jointDistance || !actualHeight || !connectors) return;

        const distance = parseFloat(jointDistance);
        const height = parseFloat(actualHeight);
        if (isNaN(distance) || isNaN(height)) return;

        const slopeRaw = parseFloat(project.projectDetails?.slope || "0");
        const slope = isNaN(slopeRaw) ? 0 : slopeRaw / 100;

        const startElevation = project.elevationsDetails?.startElevation ?? 0;

        const cumulativeDistance =
            connectors.reduce((sum, c) => sum + (c.distance ?? 0), 0) +
            distance;

        const elevationDrop = cumulativeDistance * slope;
        const theoreticalElevation = startElevation - elevationDrop;
        const difference = height - theoreticalElevation;

        const newJoint = {
            jointNumber: connectors.length + 1,
            distance: parseFloat(distance.toFixed(3)),
            elevationDrop: parseFloat(elevationDrop.toFixed(3)),
            theoreticalElevation: parseFloat(theoreticalElevation.toFixed(3)),
            actualElevation: parseFloat(height.toFixed(3)),
            difference: parseFloat(difference.toFixed(3)),
        };

        setResult(newJoint);
    };

    const handleSave = () => {
        if (!project || !result) return;

        const updatedConnectors = [...(connectors || []), result];
        const updatedProject: ProjectFormData = {
            ...project,
            connectors: updatedConnectors,
        };

        updateProjectInStorage(updatedProject);
        setProject(updatedProject);
        setConnectors(updatedConnectors);
        setJointDistance("");
        setActualHeight("");
        setResult(null);
    };

    const handleFinish = () => {
        if (jointDistance.length > 0 || actualHeight.length > 0) {
            handleSave();
        }
        navigate(`/projects/${id}/review`);
    };

    // const handleDelete = (jointNumberToDelete: number) => {
    //     if (!project || !connectors) return;

    //     const updatedConnectors = connectors
    //         .filter((c) => c.jointNumber !== jointNumberToDelete)
    //         .map((c, index) => ({ ...c, jointNumber: index + 1 }));

    //     const updatedProject: ProjectFormData = {
    //         ...project,
    //         connectors: updatedConnectors,
    //     };

    //     updateProjectInStorage(updatedProject);
    //     setProject(updatedProject);
    //     setConnectors(updatedConnectors);
    // };

    if (!project) return <div>Loading project...</div>;

    return (
        <>
            <div className="flex justify-between items-center mt-4 mx-4">
                <BackButton />
                <CameraBtn id={project.id ?? "0"} />
            </div>
            <ProjectDetailsSection project={project} />
            <ConnectorsList
                connectors={connectors}
                // onDelete={handleDelete}
            />

            <div className="bg-white rounded-xl shadow-lg p-6 m-4 space-y-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                    Add Connector Distances
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Enter joint distance (m)
                        </label>
                        <input
                            type="number"
                            step="any"
                            value={jointDistance}
                            onChange={(e) => setJointDistance(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-[#5AB8C8] focus:border-[#5AB8C8]"
                            min="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Enter joint height (m)
                        </label>
                        <input
                            type="number"
                            step="any"
                            value={actualHeight}
                            onChange={(e) => setActualHeight(e.target.value)}
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-[#5AB8C8] focus:border-[#5AB8C8]"
                            min="0"
                        />
                    </div>
                </div>

                <button
                    onClick={handleCalculate}
                    disabled={!jointDistance || !actualHeight}
                    className={`w-full font-semibold py-2 rounded-lg transition ${
                        jointDistance && actualHeight
                            ? "bg-[#5AB8C8] hover:bg-[#499cac] text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    Calculate
                </button>

                {result && <ConnectorResultForm result={result} />}

                <div className="mt-6 flex justify-end gap-x-4">
                    <button
                        onClick={handleSave}
                        disabled={!result}
                        className={`px-6 py-2 rounded-xl text-sm font-medium transition ${
                            result
                                ? "bg-[#5AB8C8] hover:bg-[#499cac] text-white"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        Save
                    </button>
                    <button
                        onClick={handleFinish}
                        className="bg-green-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition"
                    >
                        Finish
                    </button>
                </div>
            </div>
        </>
    );
};

export default Connectors;
