import api from "@/lib/api";

export const bookingService = {
    getVendorBookings: async () => {
        const response = await api.get("/bookings/vendor");
        return response.data;
    },

    checkIn: async (id: number) => {
        const response = await api.patch(`/bookings/${id}/check-in`);
        return response.data;
    },

    markNoShow: async (id: number) => {
        const response = await api.patch(`/bookings/${id}/no-show`);
        return response.data;
    },
};
