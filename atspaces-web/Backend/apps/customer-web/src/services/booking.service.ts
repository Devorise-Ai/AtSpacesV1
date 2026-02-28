import api from "../lib/api";

export const bookingService = {
    createBooking: async (data: any) => {
        const response = await api.post("/bookings", data);
        return response.data;
    },

    getMyBookings: async () => {
        const response = await api.get("/bookings/my");
        return response.data;
    },

    cancelBooking: async (id: number, reason?: string) => {
        const response = await api.patch(`/bookings/${id}/cancel`, { reason });
        return response.data;
    },

    checkAvailability: async (vendorServiceId: number, start: string, end: string, quantity: number = 1) => {
        const response = await api.get("/bookings/availability", {
            params: { vendorServiceId, start, end, quantity }
        });
        return response.data;
    }
};
