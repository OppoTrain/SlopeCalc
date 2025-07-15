import { useState, useEffect } from "react";
import ProjectCardEmpty from "../components/ProjectCardEmpty";
import NewProjectModal from "../components/NewProjectModal";
import ProjectCard from "../components/ProjectCard";
import type { ProjectFormData } from "../types/project";

const Home = () => {
    const [projects, setProjects] = useState<ProjectFormData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("projects");
        if (stored) {
            setProjects(JSON.parse(stored));
        }
    }, [isModalOpen]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="text-center mb-6 pt-12">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    SlopeCalc
                </h1>
                <p className="text-gray-600">
                    Manage your construction projects
                </p>
            </div>

            <div className="mb-6 text-center">
                <button
                    className="bg-[#5AB8C8] text-white font-bold py-2 px-4 rounded-xl cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add New Project
                </button>
            </div>

            <div className="space-y-4">
                {projects.length === 0 ? (
                    <ProjectCardEmpty />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-3">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <NewProjectModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};

export default Home;
