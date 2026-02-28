import api from "@/lib/api";

export const adminService = {
    getDashboardStats: async () => {
        const response = await api.get("/admin/dashboard");
        return response.data;
    },

    listUsers: async () => {
        const response = await api.get("/admin/users");
        return response.data;
    },

    listApprovalRequests: async () => {
        const response = await api.get("/admin/approval-requests");
        return response.data;
    },

    approveRequest: async (id: number, notes?: string) => {
        const response = await api.post(`/admin/approval-requests/${id}/approve`, { notes });
        return response.data;
    },

    rejectRequest: async (id: number, notes: string) => {
        const response = await api.post(`/admin/approval-requests/${id}/reject`, { notes });
        return response.data;
    },

    suspendUser: async (id: number) => {
        const response = await api.patch(`/admin/users/${id}/suspend`);
        return response.data;
    },

    activateUser: async (id: number) => {
        const response = await api.patch(`/admin/users/${id}/activate`);
        return response.data;
    },

    listBranches: async (city?: string) => {
        const response = await api.get("/branches", { params: { city } });
        return response.data;
    },
};
