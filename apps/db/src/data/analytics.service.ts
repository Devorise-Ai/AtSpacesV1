import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';

@Injectable()
export class AnalyticsService {
    private prisma = new PrismaClient();

    /**
     * Calculates occupancy rates grouped by city for Admin Dashboard.
     */
    async getOccupancyByCity() {
        return await this.prisma.$queryRaw`
      SELECT 
        b.city, 
        COUNT(bk.id)::FLOAT / COUNT(DISTINCT b.id) as avg_bookings_per_branch
      FROM "Branch" b
      LEFT JOIN "Booking" bk ON b.id = bk."branchId"
      GROUP BY b.city
    `;
    }

    /**
     * Calculates revenue per service type.
     */
    async getRevenueByServiceType() {
        return await this.prisma.booking.groupBy({
            by: ['serviceId'],
            _sum: {
                totalPrice: true,
            },
        });
    }

    /**
     * Generates a revenue report for a vendor in Excel format.
     */
    async generateVendorExcelReport(vendorId: string) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Revenue Report');

        const bookings = await this.prisma.booking.findMany({
            where: {
                branch: {
                    vendorId: vendorId
                }
            },
            include: {
                branch: true,
                service: true
            }
        });

        worksheet.columns = [
            { header: 'Booking ID', key: 'id', width: 20 },
            { header: 'Branch', key: 'branch', width: 20 },
            { header: 'Service', key: 'service', width: 20 },
            { header: 'Total Price (JOD)', key: 'price', width: 15 },
            { header: 'Date', key: 'date', width: 15 },
        ];

        bookings.forEach(b => {
            worksheet.addRow({
                id: b.id,
                branch: b.branch.name,
                service: b.service.name,
                price: b.totalPrice,
                date: b.createdAt.toDateString()
            });
        });

        return await workbook.xlsx.writeBuffer();
    }

    /**
     * Generates a simple PDF summary of branch usage.
     */
    async generateUsageSummaryPDF(branchId: string) {
        const doc = new jsPDF();
        const branch = await this.prisma.branch.findUnique({
            where: { id: branchId },
            include: { _count: { select: { bookings: true } } }
        });

        doc.text(`Usage Report for: ${branch?.name}`, 10, 10);
        doc.text(`Total Bookings: ${branch?._count.bookings}`, 10, 20);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 30);

        return doc.output('arraybuffer');
    }
}
