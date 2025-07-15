const ProjectCardEmpty = () => (
    <div className="card text-center py-12">
        <div className="text-gray-500 mb-4">
            <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                />
            </svg>
            <p className="text-lg font-medium">No projects yet</p>
            <p className="text-sm">Create your first project to get started</p>
        </div>
    </div>
);

export default ProjectCardEmpty;
