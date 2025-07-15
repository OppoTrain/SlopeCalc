import { z } from "zod";

export const projectSchema = z.object({
    id: z.string().min(1).optional(),
    projectDetails: z.object({
        projectName: z.string().min(1, "Project name is required"),
        contractorName: z.string().min(1, "Contractor name is required"),
        date: z.string().min(1, "Date is required"),
        inspectorName: z.string().min(1, "Inspector name is required"),
        location: z.string().min(1, "Location is required"),
        slope: z.string().optional(),
    }),
    pipeDetails: z.object({
        pipeDiameter: z.string().min(1, "Pipe diameter is required"),
        pipeType: z.string().min(1, "Pipe type is required"),
        pipeLength: z.number().optional(),
    }),
    manholeDetails: z.object({
        startManhole: z.string().min(1, "Start manhole is required"),
        endManhole: z.string().min(1, "End manhole is required"),
    }),
    elevationsDetails: z.object({
        startElevation: z.number().optional(),
        endElevation: z.number().optional(),
    }).optional(),
    connectors: z.array(
        z.object({
            jointNumber: z.number().optional(),
            distance: z.number().optional(),
            elevationDrop: z.number().optional(),
            theoreticalElevation: z.number().optional(),
            actualElevation: z.number().optional(),
            difference: z.number().optional(),
        })
    ).optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
