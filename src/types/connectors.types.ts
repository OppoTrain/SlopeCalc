import { z } from "zod";

export const connectorsSchema = z.object({
    jointNumber: z.number().min(1, "Joint number is required"),
    distance: z.number().min(1, "Distance is required"),
    elevationDrop: z.number().min(1, "Elevation drop is required"),
    theoreticalElevation: z
        .number()
        .min(1, "Theoretical elevation is required"),
    actualElevation: z.number().min(1, "Actual elevation is required"),
    difference: z.number().min(1, "Difference is required"),
});

export type ConnectorType = z.infer<typeof connectorsSchema>;
