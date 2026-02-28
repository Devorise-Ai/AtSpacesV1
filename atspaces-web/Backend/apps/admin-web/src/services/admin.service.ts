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

    pauseBranch: async (id: number) => {
        const response = await api.patch(`/admin/branches/${id}/pause`);
        return response.data;
    },

    resumeBranch: async (id: number) => {
        const response = await api.patch(`/admin/branches/${id}/resume`);
        return response.data;
    },

    updateBranchAmenities: async (id: number, facilities: string[]) => {
        const response = await api.patch(`/admin/branches/${id}/amenities`, { facilities });
        return response.data;
    },

    updatePricing: async (serviceId: number, data: { pricePerUnit?: number; priceUnit?: string }) => {
        const response = await api.patch(`/admin/pricing/${serviceId}`, data);
        return response.data;
    },
};

