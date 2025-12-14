'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { taskApi, Task, GetTasksParams } from '@/lib/api/task.api';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';

export default function DashboardPage() {
    const router = useRouter();
    const { user, logout, isLoading: authLoading, isAuthenticated } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    // Filter states
    const [filters, setFilters] = useState<GetTasksParams>({
        status: undefined,
        priority: undefined,
        sort: 'createdAt',
        order: 'desc',
    });

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Client-side protection
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    // Fetch tasks
    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await taskApi.getTasks(filters);
            setTasks(response.data.data);
            setError('');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: { message?: string } } } };
            setError(error.response?.data?.error?.message || 'Failed to load tasks');
        } finally {
            setIsLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchTasks();
        }
    }, [isAuthenticated, fetchTasks]);

    // Handle create task
    const handleCreateTask = async (data: import('@/lib/api/task.api').CreateTaskInput | import('@/lib/api/task.api').UpdateTaskInput) => {
        try {
            await taskApi.createTask(data as import('@/lib/api/task.api').CreateTaskInput);
            setSuccess('Task created successfully!');
            setIsCreateModalOpen(false);
            fetchTasks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: { message?: string } } } };
            setError(error.response?.data?.error?.message || 'Failed to create task');
        }
    };

    // Handle edit task
    const handleEditTask = async (data: import('@/lib/api/task.api').CreateTaskInput | import('@/lib/api/task.api').UpdateTaskInput) => {
        if (!editingTask) return;
        try {
            await taskApi.updateTask(editingTask._id, data as import('@/lib/api/task.api').UpdateTaskInput);
            setSuccess('Task updated successfully!');
            setIsEditModalOpen(false);
            setEditingTask(null);
            fetchTasks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: { message?: string } } } };
            setError(error.response?.data?.error?.message || 'Failed to update task');
        }
    };

    // Handle delete task
    const handleDeleteTask = async () => {
        if (!deletingTaskId) return;
        try {
            await taskApi.deleteTask(deletingTaskId);
            setSuccess('Task deleted successfully!');
            setIsDeleteModalOpen(false);
            setDeletingTaskId(null);
            fetchTasks();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: { message?: string } } } };
            setError(error.response?.data?.error?.message || 'Failed to delete task');
        }
    };

    // Handle status change
    const handleStatusChange = async (id: string, status: Task['status']) => {
        try {
            await taskApi.updateTaskStatus(id, status);
            setSuccess('Status updated!');
            fetchTasks();
            setTimeout(() => setSuccess(''), 2000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: { message?: string } } } };
            setError(error.response?.data?.error?.message || 'Failed to update status');
        }
    };

    // Filter tasks client-side for search
    const filteredTasks = tasks.filter((task) =>
        searchQuery
            ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase())
            : true
    );

    // Calculate stats
    const stats = {
        total: tasks.length,
        completed: tasks.filter((t) => t.status === 'completed').length,
        inProgress: tasks.filter((t) => t.status === 'in-progress').length,
        pending: tasks.filter((t) => t.status === 'pending').length,
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Welcome back, <span className="font-semibold">{user?.name}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-sm text-gray-600">
                                {user?.email}
                            </div>
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Alerts */}
                {error && (
                    <div className="mb-6">
                        <Alert type="error" message={error} onClose={() => setError('')} />
                    </div>
                )}
                {success && (
                    <div className="mb-6">
                        <Alert type="success" message={success} onClose={() => setSuccess('')} />
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Tasks</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="bg-primary-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">In Progress</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3">
                            <select
                                value={filters.status || ''}
                                onChange={(e) => setFilters({ ...filters, status: (e.target.value as Task['status']) || undefined })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>

                            <select
                                value={filters.priority || ''}
                                onChange={(e) => setFilters({ ...filters, priority: (e.target.value as Task['priority']) || undefined })}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">All Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>

                            <select
                                value={`${filters.sort}-${filters.order}`}
                                onChange={(e) => {
                                    const [sort, order] = e.target.value.split('-');
                                    setFilters({ ...filters, sort: sort as GetTasksParams['sort'], order: order as GetTasksParams['order'] });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="createdAt-desc">Newest First</option>
                                <option value="createdAt-asc">Oldest First</option>
                                <option value="dueDate-asc">Due Date (Soon)</option>
                                <option value="title-asc">Title (A-Z)</option>
                            </select>

                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Task
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading tasks...</p>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                        <p className="text-gray-600 mb-4">
                            {searchQuery ? 'Try a different search term' : 'Get started by creating your first task'}
                        </p>
                        <Button onClick={() => setIsCreateModalOpen(true)}>Create Task</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTasks.map((task) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                onEdit={(task) => {
                                    setEditingTask(task);
                                    setIsEditModalOpen(true);
                                }}
                                onDelete={(id) => {
                                    setDeletingTaskId(id);
                                    setIsDeleteModalOpen(true);
                                }}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Create Task Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Task"
            >
                <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsCreateModalOpen(false)} />
            </Modal>

            {/* Edit Task Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingTask(null);
                }}
                title="Edit Task"
            >
                <TaskForm
                    task={editingTask || undefined}
                    onSubmit={handleEditTask}
                    onCancel={() => {
                        setIsEditModalOpen(false);
                        setEditingTask(null);
                    }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingTaskId(null);
                }}
                title="Delete Task"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete this task? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <Button variant="outline" fullWidth onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            fullWidth
                            onClick={handleDeleteTask}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
