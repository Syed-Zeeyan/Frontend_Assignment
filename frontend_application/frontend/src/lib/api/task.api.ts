import { apiClient } from './client';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskInput {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface UpdateTaskInput {
    title?: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface GetTasksParams {
    page?: number;
    limit?: number;
    status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    sort?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title';
    order?: 'asc' | 'desc';
}

export interface TasksResponse {
    success: boolean;
    data: {
        data: Task[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export const taskApi = {
    /**
     * Get all tasks with pagination and filters
     */
    getTasks: async (params?: GetTasksParams): Promise<TasksResponse> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.priority) queryParams.append('priority', params.priority);
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.order) queryParams.append('order', params.order);

        const query = queryParams.toString();
        return apiClient.get(`/tasks${query ? `?${query}` : ''}`);
    },

    /**
     * Get single task by ID
     */
    getTask: async (id: string): Promise<{ success: boolean; data: { task: Task } }> => {
        return apiClient.get(`/tasks/${id}`);
    },

    /**
     * Create new task
     */
    createTask: async (data: CreateTaskInput): Promise<{ success: boolean; data: { task: Task } }> => {
        return apiClient.post('/tasks', data);
    },

    /**
     * Update task
     */
    updateTask: async (
        id: string,
        data: UpdateTaskInput
    ): Promise<{ success: boolean; data: { task: Task } }> => {
        return apiClient.put(`/tasks/${id}`, data);
    },

    /**
     * Update task status only
     */
    updateTaskStatus: async (
        id: string,
        status: 'pending' | 'in-progress' | 'completed'
    ): Promise<{ success: boolean; data: { task: Task } }> => {
        return apiClient.patch(`/tasks/${id}/status`, { status });
    },

    /**
     * Delete task
     */
    deleteTask: async (id: string): Promise<{ success: boolean }> => {
        return apiClient.delete(`/tasks/${id}`);
    },
};
