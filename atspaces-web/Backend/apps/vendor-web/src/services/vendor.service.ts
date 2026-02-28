import api from "@/lib/api";

export const vendorService = {
    getDashboardStats: async () => {
        const response = await api.get("/vendor/dashboard");
        return response.data;
    },

    getMyBranches: async () => {
        const response = await api.get("/vendor/branches");
        return response.data;
    },

    getBranchDetails: async (id: number) => {
        const response = await api.get(`/vendor/branches/${id}`);
        return response.data;
    },

    createBranch: async (data: any) => {
        const response = await api.post("/vendor/branches", data);
        return response.data;
    },

    updateBranch: async (id: number, data: any) => {
        const response = await api.patch(`/vendor/branches/${id}`, data);
        return response.data;
    },

    submitApprovalRequest: async (data: any) => {
        const response = await api.post("/vendor/approval-requests", data);
        return response.data;
    },
};
