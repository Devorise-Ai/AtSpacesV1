import api from "../lib/api";

export const publicService = {
    listBranches: async (city?: string) => {
        const response = await api.get("/branches", {
            params: { city }
        });
        return response.data;
    },

    getBranchDetails: async (id: number) => {
        const response = await api.get(`/branches/${id}`);
        return response.data;
    },

    getFacilities: async () => {
        const response = await api.get("/facilities");
        return response.data;
    }
};
