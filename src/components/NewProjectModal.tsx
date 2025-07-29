import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormData } from "../types/project";
import { fields } from "../utils/ProjectFields";

const NewProjectModal = ({ onClose }: { onClose: () => void }) => {
    const todayDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().slice(0, 5);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            projectDetails: {
                date: todayDate,
                time: currentTime,
            },
        },
    });

    const onSubmit = (data: ProjectFormData) => {
        const id = Date.now().toString();
        const newProject = { ...data, id };
        const existing = JSON.parse(localStorage.getItem("projects") || "[]");
        localStorage.setItem(
            "projects",
            JSON.stringify([...existing, newProject])
        );
        reset();
        onClose();
    };

    return (
        <div
            id="crud-modal"
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
            <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        New Project
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 rounded-lg text-sm w-8 h-8 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 md:p-5 space-y-4"
                >
                    {fields.map(
                        ({ name, label, type = "text", placeHolder }) => {
                            const [group, field] = name.split(".");
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const fieldError = (errors as any)?.[group]?.[
                                field
                            ];

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
                                        placeholder={placeHolder}
                                        {...register(
                                            name as keyof ProjectFormData
                                        )}
                                        className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {fieldError && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {fieldError.message}
                                        </p>
                                    )}
                                </div>
                            );
                        }
                    )}

                    <div className="flex space-between space-x-2">
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
                            Add Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewProjectModal;
