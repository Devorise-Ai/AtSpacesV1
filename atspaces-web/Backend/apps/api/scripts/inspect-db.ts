
import { PrismaClient } from '@prisma/client';
import { resolve } from 'path';
import { config } from 'dotenv';

// Load environment variables
const rootEnv = resolve(process.cwd(), '.env');
const apiEnv = resolve(process.cwd(), 'apps/api/.env');
config({ path: rootEnv });
config({ path: apiEnv });

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Final Inspection ---');
    console.log(`Connection URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}`);

    try {
        // 1. Table Summary using plural names from schema.prisma @@map
        const tables: any[] = await prisma.$queryRaw`
            SELECT 
                table_name, 
                (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
            FROM (
                SELECT 
                    table_name, 
                    query_to_xml(format('SELECT count(*) as cnt FROM %I', table_name), false, true, '') as xml_count
                FROM information_schema.tables
                WHERE table_schema = 'public'
            ) t
            ORDER BY row_count DESC;
        `;

        console.log('\n--- Table Summary ---');
        console.table(tables);

        // 2. Latest Users (Table: users, Column: full_name, created_at)
        const latestUsers = await prisma.$queryRaw`
            SELECT id, email, full_name, role, created_at 
            FROM "users" 
            ORDER BY id DESC 
            LIMIT 5;
        `;
        console.log('\n--- Latest 5 Users ---');
        console.table(latestUsers);

        // 3. Latest Bookings (Table: bookings, Column: booking_date)
        const latestBookings = await prisma.$queryRaw`
            SELECT b.id, u.email as customer, b.status, b.booking_date
            FROM "bookings" b
            JOIN "users" u ON b.customer_id = u.id
            ORDER BY b.id DESC
            LIMIT 5;
        `;
        console.log('\n--- Latest 5 Bookings ---');
        console.table(latestBookings);

        // 4. Latest Approval Requests
        const latestRequests = await prisma.$queryRaw`
            SELECT id, request_type, status, created_at
            FROM "approval_requests"
            ORDER BY id DESC
            LIMIT 5;
        `;
        console.log('\n--- Latest 5 Approval Requests ---');
        console.table(latestRequests);

    } catch (error) {
        console.error('Error during final inspection:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
