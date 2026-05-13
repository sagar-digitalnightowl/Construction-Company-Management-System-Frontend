import api from "./axios";

export const taskApi = {
    createTask: (projectId, data) => api.post(`/task/project/${projectId}`, data),

    
}
