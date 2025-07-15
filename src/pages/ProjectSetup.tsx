import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { projectSchema, type ProjectFormData } from "../types/project";
import ProjectDetailsSection from "../components/ProjectDetails";
import BackButton from "../components/BackButton";

const ProjectSetup = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState<ProjectFormData | null>(null);
    const [slope, setSlope] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormData>({
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
        }
    }, [id, reset]);

    const isReadOnly = !!project?.projectDetails?.slope;

    const onSubmit = (data: ProjectFormData) => {
        const startElevation = data.elevationsDetails?.startElevation ?? 0;
        const endElevation = data.elevationsDetails?.endElevation ?? 0;
        const length = data.pipeDetails.pipeLength ?? 1;

        const rise = endElevation - startElevation;
        const calculatedSlope = (rise / length) * 100;
        const roundedSlope = parseFloat(calculatedSlope.toFixed(2));

        setSlope(roundedSlope);

        const updatedProject = {
            ...data,
            id,
            projectDetails: {
                ...data.projectDetails,
                slope: roundedSlope.toString(),
            },
        };

        const storedProjects = JSON.parse(
            localStorage.getItem("projects") || "[]"
        );
        const updatedProjects = storedProjects.map((proj: ProjectFormData) =>
            proj.id === id ? updatedProject : proj
        );

        localStorage.setItem("projects", JSON.stringify(updatedProjects));
    };

    const handleNext = () => {
        navigate(`/projects/${id}/connector`);
    };

    if (!project) return <div>Loading project...</div>;

    return (
        <>
            <BackButton />
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
                        className="text-gray-500 hover:text-gray-700 transition"
                        type="button"
                        aria-label="Capture Photo"
                        title="Capture Photo"
                    >
                        📷
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
                            disabled={isReadOnly}
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
                            disabled={isReadOnly}
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
                            disabled={isReadOnly}
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

                {!isReadOnly && (
                    <button
                        type="submit"
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
                                onClick={handleNext}
                                type="button"
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
