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

    getAvailability: async (serviceId: number) => {
        const response = await api.get(`/vendor/availability/${serviceId}`);
        return response.data;
    },

    toggleAvailabilityBlock: async (id: number) => {
        const response = await api.post("/vendor/availability/toggle-block", { availabilityId: id });
        return response.data;
    },

    updateService: async (id: number, data: any) => {
        const response = await api.patch(`/vendor/services/${id}`, data);
        return response.data;
    },
};
