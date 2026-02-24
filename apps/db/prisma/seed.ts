import { PrismaClient, Role, ServiceType, BranchStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seeding...');

    // 1. Create Vendors
    const vendor1 = await prisma.user.upsert({
        where: { email: 'vendor1@cowork.jo' },
        update: {},
        create: {
            email: 'vendor1@cowork.jo',
            password: 'hashed_password_123',
            name: 'Jordan Hubs Co',
            role: Role.VENDOR,
        },
    });

    // 2. Create Branches in different cities
    const ammanBranch = await prisma.branch.create({
        data: {
            name: 'Amman Downtown Hub',
            city: 'Amman',
            address: 'Rainbow Street, Building 4',
            status: BranchStatus.MODERATE,
            vendorId: vendor1.id,
        },
    });

    const irbidBranch = await prisma.branch.create({
        data: {
            name: 'Irbid Tech Center',
            city: 'Irbid',
            address: 'University St, Near Jordan University of Science and Technology',
            status: BranchStatus.CALM,
            vendorId: vendor1.id,
        },
    });

    // 3. Create Services for Amman Branch
    await prisma.service.createMany({
        data: [
            {
                name: 'Desk #1',
                type: ServiceType.HOT_DESK,
                hourlyRate: 2.0,
                dailyRate: 10.0,
                weeklyRate: 45.0,
                branchId: ammanBranch.id,
            },
            {
                name: 'Meeting Room Alpha',
                type: ServiceType.MEETING_ROOM,
                hourlyRate: 15.0,
                dailyRate: 80.0,
                weeklyRate: 350.0,
                branchId: ammanBranch.id,
            },
            {
                name: 'Private Office 101',
                type: ServiceType.PRIVATE_OFFICE,
                hourlyRate: 25.0,
                dailyRate: 150.0,
                weeklyRate: 600.0,
                branchId: ammanBranch.id,
            },
        ],
    });

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
