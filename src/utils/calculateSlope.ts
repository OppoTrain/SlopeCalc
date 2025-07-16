import type { ProjectFormData } from "../types/project";

export const calculateSlope = (data: ProjectFormData) => {
    const startElevation = data.elevationsDetails?.startElevation ?? 0;
    const endElevation = data.elevationsDetails?.endElevation ?? 0;
    const length = data.pipeDetails?.pipeLength ?? 1;

    if (length === 0) return 0;

    const rise = endElevation - startElevation;
    const calculatedSlope = (rise / length) * 100;
    return parseFloat(calculatedSlope.toFixed(2));
};