import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { projectSchema, type ProjectFormData } from "../types/project";
import ProjectDetailsSection from "../components/ProjectDetails";
import BackButton from "../components/BackButton";
import CameraBtn from "../components/CameraBtn";
import { calculateSlope } from "../utils/calculateSlope";
import { resetConnectors } from "../utils/resetConnectors";

const ProjectSetup = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState<ProjectFormData | null>(null);
    const [slope, setSlope] = useState<number | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
        setError,
    } = useForm<ProjectFormData>({
        mode: "onChange",
        resolver: zodResolver(projectSchema),
        defaultValues: {},
    });

    useEffect(() => {
        const storedProjects = JSON.parse(
            localStorage.getItem("projects") || "[]"
        );
        const currentProject: ProjectFormData = storedProjects.find(
            (p: ProjectFormData) => p.id === id
        );

        setProject(currentProject || null);

        if (currentProject) {
            reset(currentProject);
            const slopeValue = currentProject.projectDetails?.slope;
            if (slopeValue) {
                setSlope(parseFloat(slopeValue));
            }
            setIsEdit(!!slopeValue);
        }
    }, [id, reset]);

    const handleCalculateSlope = () => {
        const formValues = getValues();
        const calculatedSlope = calculateSlope(formValues);

        if (isNaN(formValues.pipeDetails.pipeLength ?? NaN)) {
            setError("pipeDetails.pipeLength", {
                type: "manual",
                message: "Pipe Length is required.",
            });
        }

        if (
            !formValues.elevationsDetails ||
            isNaN(formValues.elevationsDetails.startElevation ?? NaN)
        ) {
            setError("elevationsDetails.startElevation", {
                type: "manual",
                message: "Start elevation is required.",
            });
        }

        if (
            !formValues.elevationsDetails ||
            isNaN(formValues.elevationsDetails.endElevation ?? NaN)
        ) {
            setError("elevationsDetails.endElevation", {
                type: "manual",
                message: "End elevation is required.",
            });
        }

        if (isNaN(calculatedSlope)) {
            return;
        }

        setSlope(calculatedSlope);

        const updatedProject: ProjectFormData = {
            ...formValues,
            projectDetails: {
                ...formValues.projectDetails,
                slope: calculatedSlope.toString(),
            },
        };

        setProject(updatedProject);
    };

    const onSubmit = (data: ProjectFormData) => {
        const storedProjects = JSON.parse(
            localStorage.getItem("projects") || "[]"
        );
        const currentProject: ProjectFormData = storedProjects.find(
            (p: ProjectFormData) => p.id === id
        );

        if (slope?.toString() === currentProject.projectDetails?.slope) {
            navigate(`/projects/${id}/connector`);
            return;
        }

        const updatedData: ProjectFormData = {
            ...data,
            projectDetails: {
                ...data.projectDetails,
                slope: slope?.toString(),
            },
        };

        const updatedProjects = storedProjects.map((proj: ProjectFormData) =>
            proj.id === data.id ? updatedData : proj
        );
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
        setIsEdit(true);
        resetConnectors(data.id ?? "0");
        navigate(`/projects/${id}/connector`);
    };

    const handleEdit = () => {
        if (
            window.confirm(
                "Are you sure you want to edit the slope?\nBy doing this, you will lose all connector data."
            )
        ) {
            setIsEdit(false);
        }
    };

    if (!project) return <div>Loading project...</div>;

    return (
        <>
            <div className="flex justify-between items-center mt-4 mx-4">
                <BackButton />
                <CameraBtn id={project.id ?? "0"} />
            </div>

            <ProjectDetailsSection project={project} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-xl shadow-lg p-6 m-4 space-y-6 border border-gray-200"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Pipe Setup
                    </h2>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl text-sm font-medium transition"
                        onClick={handleEdit}
                        type="button"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Total Pipe Length (m)
                        </label>
                        <input
                            type="number"
                            step="any"
                            min={0}
                            disabled={isEdit}
                            {...register("pipeDetails.pipeLength", {
                                valueAsNumber: true,
                            })}
                            className="w-full rounded-md border border-gray-300 focus:ring-[#5AB8C8] focus:border-[#5AB8C8] p-2 text-sm"
                        />
                        {errors.pipeDetails?.pipeLength && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.pipeDetails.pipeLength.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Start Elevation (m)
                        </label>
                        <input
                            type="number"
                            step="any"
                            min={0}
                            disabled={isEdit}
                            {...register("elevationsDetails.startElevation", {
                                valueAsNumber: true,
                            })}
                            className="w-full rounded-md border border-gray-300 focus:ring-[#5AB8C8] focus:border-[#5AB8C8] p-2 text-sm"
                        />
                        {errors.elevationsDetails?.startElevation && (
                            <p className="text-red-500 text-sm mt-1">
                                {
                                    errors.elevationsDetails.startElevation
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            End Elevation (m)
                        </label>
                        <input
                            type="number"
                            step="any"
                            min={0}
                            disabled={isEdit}
                            {...register("elevationsDetails.endElevation", {
                                valueAsNumber: true,
                            })}
                            className="w-full rounded-md border border-gray-300 focus:ring-[#5AB8C8] focus:border-[#5AB8C8] p-2 text-sm"
                        />
                        {errors.elevationsDetails?.endElevation && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.elevationsDetails.endElevation.message}
                            </p>
                        )}
                    </div>
                </div>

                {!isEdit && (
                    <button
                        type="button"
                        onClick={handleCalculateSlope}
                        className="w-full bg-[#5AB8C8] hover:bg-[#499cac] text-white font-semibold py-2 rounded-lg transition"
                    >
                        Calculate the Slope
                    </button>
                )}

                {slope !== null && (
                    <>
                        <div className="text-center text-xl font-bold text-gray-800">
                            Slope: {slope}%
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-[#5AB8C8] hover:bg-[#499cac] text-white px-6 py-2 rounded-xl text-sm font-medium transition"
                                type="submit"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </form>
        </>
    );
};

export default ProjectSetup;
