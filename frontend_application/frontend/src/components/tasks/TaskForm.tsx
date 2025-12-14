import React, { useState, FormEvent } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/api/task.api';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface TaskFormProps {
    task?: Task;
    onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
    onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<CreateTaskInput>({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'pending',
        priority: task?.priority || 'medium',
        dueDate: task?.dueDate ? task.dueDate.split('T')[0] : '',
    });

    const [errors, setErrors] = useState({
        title: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = (): boolean => {
        if (!formData.title || formData.title.length < 3) {
            setErrors({ title: 'Title must be at least 3 characters' });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        try {
            const submitData = {
                ...formData,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
            };
            await onSubmit(submitData);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Task Title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="Enter task title"
                required
                disabled={isLoading}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description (optional)"
                    rows={4}
                    disabled={isLoading}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                    </label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <Input
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={isLoading}
            />

            <div className="flex gap-3 pt-4">
                <Button type="submit" fullWidth isLoading={isLoading}>
                    {task ? 'Update Task' : 'Create Task'}
                </Button>
                <Button type="button" variant="outline" fullWidth onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};
