import { PrismaClient, UserRole } from '../../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({adapter});

interface SeedUser {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  district?: string;
  sector?: string;
}

const TEST_PASSWORD = 'Password123!';

const seedUsers: SeedUser[] = [
  {
    phone: '+250788000001',
    email: 'admin1@hbridge.rw',
    firstName: 'Admin',
    lastName: 'HBridge',
    role: UserRole.ADMIN,
  },

  {
    phone: '+250788000003',
    email: 'chw@hbridge.rw',
    firstName: 'Jean',
    lastName: 'Mukamana',
    role: UserRole.CHW,
    district: 'Gasabo',
    sector: 'Remera',
  },
  {
    phone: '+250788000004',
    email: 'nurse@hbridge.rw',
    firstName: 'Alice',
    lastName: 'Uwimana',
    role: UserRole.NURSE,
    district: 'Gasabo',
    sector: 'Remera',
  },
  {
    phone: '+250788000005',
    email: 'doctor@hbridge.rw',
    firstName: 'Eric',
    lastName: 'Niyonzima',
    role: UserRole.DOCTOR,
    district: 'Gasabo',
    sector: 'Remera',
  },
  {
    phone: '+250788000006',
    email: 'mh@hbridge.rw',
    firstName: 'Diane',
    lastName: 'Ingabire',
    role: UserRole.MH_PROFESSIONAL,
    district: 'Gasabo',
    sector: 'Remera',
  },
];

async function seedUsersFn() {
  console.log('Seeding users...');
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

  for (const user of seedUsers) {
    const created = await prisma.user.upsert({
      where: { phone: user.phone },
      update: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        district: user.district ?? null,
        sector: user.sector ?? null,
        passwordHash,
        isActive: true,
      },
      create: {
        phone: user.phone,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        district: user.district ?? null,
        sector: user.sector ?? null,
        passwordHash,
      },
    });
    console.log(`${created.role.padEnd(16)} ${created.phone}`);
  }
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  HBridge Seed Script');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await seedUsersFn();

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Seeding complete');
  console.log('');
  console.log(`  All test users have password: ${TEST_PASSWORD}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });