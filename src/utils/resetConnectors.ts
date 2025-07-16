import type { ProjectFormData } from "../types/project";

export const resetConnectors = (projectId: string) => {
    const storedProjects = JSON.parse(localStorage.getItem("projects") || "[]");

    const updatedProjects = storedProjects.map((project: ProjectFormData) => {
        if (project.id === projectId) {
            return {
                ...project,
                connectors: [],
            };
        }
        return project;
    });

    localStorage.setItem("projects", JSON.stringify(updatedProjects));
};
