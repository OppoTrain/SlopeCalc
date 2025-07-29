import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormData } from "../types/project";
import { fields } from "../utils/ProjectFields";

const EditProjectModal = ({
    project,
    onClose,
}: {
    project: ProjectFormData;
    onClose: () => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: project,
    });

    const handleSave = (updatedProject: ProjectFormData) => {
        const existing = JSON.parse(localStorage.getItem("projects") || "[]");
        const updated = existing.map((p: ProjectFormData) =>
            p.id === updatedProject.id ? updatedProject : p
        );
        localStorage.setItem("projects", JSON.stringify(updated));
        onClose();
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-lg font-semibold">Edit Project</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm w-8 h-8 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
                    {fields.map(({ name, label, type = "text" }) => {
                        const [group, field] = name.split(".");
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const fieldError = (errors as any)?.[group]?.[field];

                        return (
                            <div key={name}>
                                <label
                                    htmlFor={name}
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    {label} *
                                </label>
                                <input
                                    id={name}
                                    type={type}
                                    min={type === "number" ? 0 : undefined}
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                    {...register(name as keyof ProjectFormData)}
                                    className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {fieldError && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {fieldError.message}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full px-4 py-2 rounded-md bg-gray-300 text-gray-700 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 rounded-md bg-[#5AB8C8] text-white cursor-pointer"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;
