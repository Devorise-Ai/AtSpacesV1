import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Database Cleanup ---');
    // Delete in reverse order of dependencies to avoid FK constraints
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.vendorService.deleteMany();
    await prisma.branchFacility.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.serviceFeature.deleteMany();

    // Core lookups
    await prisma.facility.deleteMany();
    await prisma.feature.deleteMany();
    await prisma.service.deleteMany();

    // Users & Branches
    await prisma.approvalRequest.deleteMany();
    await prisma.otpSession.deleteMany();
    await prisma.branch.deleteMany();
    await prisma.user.deleteMany();
    console.log('Existing data cleared.');

    console.log('\n--- Seeding Initial Data ---');

    console.log('Seeding Facilities...');
    const facilityWifi = await prisma.facility.create({ data: { name: 'WiFi', icon: 'wifi' } });
    const facilityParking = await prisma.facility.create({ data: { name: 'Parking', icon: 'local_parking' } });
    const facilityCoffee = await prisma.facility.create({ data: { name: 'Coffee', icon: 'coffee' } });
    const facilityPrinter = await prisma.facility.create({ data: { name: 'Printer', icon: 'print' } });

    console.log('Seeding Services...');
    const serviceHotDesk = await prisma.service.create({ data: { name: 'hot_desk', description: 'Flexible desk in shared area', unit: 'seat' } });
    const servicePrivateOffice = await prisma.service.create({ data: { name: 'private_office', description: 'Private locked office space', unit: 'office' } });
    const serviceMeetingRoom = await prisma.service.create({ data: { name: 'meeting_room', description: 'Bookable meeting room with AV', unit: 'room' } });

    console.log('Seeding Master Vendor User...');
    const vendorUser = await prisma.user.create({
        data: {
            fullName: 'AtSpaces Master Vendor',
            email: 'vendor@atspaces.jo',
            role: 'vendor',
            status: 'active',
        }
    });

    console.log('Seeding 10 Jordanian Branches...');
    const branchesData = [
        { name: 'Abdali Tech Hub', city: 'Amman', address: 'Abdali Boulevard, Tower 2' },
        { name: 'Rainbow Makerspace', city: 'Amman', address: 'Rainbow Street, Building 45' },
        { name: 'Irbid Innovation Center', city: 'Irbid', address: 'University Road, near Yarmouk' },
        { name: 'Red Sea Coworking', city: 'Aqaba', address: 'King Hussein St, Near Port Village' },
        { name: 'Zarqa Business Space', city: 'Zarqa', address: 'Army St, City Center' },
        { name: 'Salt Heritage Hub', city: 'Salt', address: 'Al Mydan St, Old City' },
        { name: 'Madaba Creators', city: 'Madaba', address: 'King Talal St, near Mosaics' },
        { name: 'Jerash Workspace', city: 'Jerash', address: 'Roman Ruins Road' },
        { name: 'Karak Castle Hub', city: 'Karak', address: 'Castle View Road' },
        { name: 'Ajloun Pines Coworking', city: 'Ajloun', address: 'Ajloun Forest Road' },
    ];

    for (const data of branchesData) {
        // Create the branch
        const branch = await prisma.branch.create({
            data: {
                vendorId: vendorUser.id,
                name: data.name,
                city: data.city,
                address: data.address,
                description: `A premium AtSpaces branch located in ${data.city}.`,
                status: 'active',
            }
        });

        // Add facilities to each branch
        await prisma.branchFacility.createMany({
            data: [
                { branchId: branch.id, facilityId: facilityWifi.id },
                { branchId: branch.id, facilityId: facilityCoffee.id },
            ]
        });

        // Add services inventory to each branch so the AI agent can book them
        await prisma.vendorService.create({
            data: {
                branchId: branch.id,
                serviceId: serviceHotDesk.id,
                pricePerUnit: 5.00,
                priceUnit: 'hour',
                maxCapacity: 20,
                isAvailable: true,
            }
        });

        await prisma.vendorService.create({
            data: {
                branchId: branch.id,
                serviceId: serviceMeetingRoom.id,
                pricePerUnit: 25.00,
                priceUnit: 'hour',
                maxCapacity: 8,
                isAvailable: true,
            }
        });

        // Add Private offices only to Amman and Irbid
        if (data.city === 'Amman' || data.city === 'Irbid') {
            await prisma.vendorService.create({
                data: {
                    branchId: branch.id,
                    serviceId: servicePrivateOffice.id,
                    pricePerUnit: 15.00,
                    priceUnit: 'hour',
                    maxCapacity: 4,
                    isAvailable: true,
                }
            });
        }
    }

    // 4. Create Customers
    console.log('Seeding Customers...');
    await prisma.user.create({
        data: {
            fullName: 'Test Customer',
            email: 'customer@example.jo',
            role: 'customer',
            status: 'active',
        }
    });

    console.log('\n--- Seeding Complete Successfully ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
