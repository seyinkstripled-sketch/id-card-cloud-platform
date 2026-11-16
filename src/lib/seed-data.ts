import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function seedInitialData() {
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@idstudio.gov.ng' },
  });

  if (!existingAdmin) {
    const adminPassword = await hashPassword('Admin123!@#');
    await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@idstudio.gov.ng',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    const operatorPassword = await hashPassword('Operator123!@#');
    await prisma.user.create({
      data: {
        name: 'Card Issuance Officer',
        email: 'operator@idstudio.gov.ng',
        password: operatorPassword,
        role: 'OPERATOR',
      },
    });
    console.log('Default users created.');
  }

  // Check if staff members exist
  const count = await prisma.staffMember.count();
  if (count === 0) {
    const today = new Date();
    const expiry = new Date();
    expiry.setFullYear(today.getFullYear() + 2);

    await prisma.staffMember.createMany({
      data: [
        {
          staffId: 'P6014',
          fullName: 'AJAYI EMMANUEL I.',
          designation: 'Asst. Data Processing Officer',
          department: 'PLANNING RES. & STATS',
          email: 'e.ajayi@fthidoekiti.gov.ng',
          phone: '+234 803 123 4567',
          bloodGroup: 'O+',
          issueDate: new Date('2024-01-01'),
          expiryDate: new Date('2025-12-31'),
          status: 'ACTIVE',
          notes: 'Official Federal Teaching Hospital Master Record',
        },
        {
          staffId: 'P6015',
          fullName: 'DR. OLATUNJI BEATRICE K.',
          designation: 'Chief Medical Officer',
          department: 'CLINICAL SERVICES',
          email: 'b.olatunji@fthidoekiti.gov.ng',
          phone: '+234 802 987 6543',
          bloodGroup: 'A+',
          issueDate: new Date('2024-03-15'),
          expiryDate: expiry,
          status: 'ACTIVE',
          notes: 'Head of Department',
        },
        {
          staffId: 'P6016',
          fullName: 'ADEBAYO SAMUEL O.',
          designation: 'Senior Nursing Officer',
          department: 'NURSING SERVICES',
          email: 's.adebayo@fthidoekiti.gov.ng',
          phone: '+234 805 456 7890',
          bloodGroup: 'B+',
          issueDate: new Date('2024-04-10'),
          expiryDate: expiry,
          status: 'ACTIVE',
          notes: 'Emergency Ward Supervisor',
        },
        {
          staffId: 'P6017',
          fullName: 'IBRAHIM FATIMA M.',
          designation: 'Principal Accountant',
          department: 'FINANCE & ACCOUNTS',
          email: 'f.ibrahim@fthidoekiti.gov.ng',
          phone: '+234 809 333 2211',
          bloodGroup: 'O-',
          issueDate: new Date('2024-02-20'),
          expiryDate: expiry,
          status: 'ACTIVE',
          notes: 'Payroll & Budget Unit',
        },
      ],
    });

    console.log('Sample hospital staff members seeded.');

    // Create initial audit log
    await prisma.auditLog.create({
      data: {
        action: 'SYSTEM_INITIALIZED',
        details: 'Initial database seed with official FTH staff profiles and administration credentials',
        ipAddress: '127.0.0.1',
      },
    });
  }

  // Ensure default template config exists
  const templateCount = await prisma.templateConfig.count();
  if (templateCount === 0) {
    await prisma.templateConfig.create({
      data: {
        name: 'Federal Teaching Hospital, Ido-Ekiti Master',
        organizationName: 'Federal Teaching Hospital, Ido-Ekiti',
        primaryColor: '#036029',
        secondaryColor: '#014e24',
        accentColor: '#A7F3D0',
        dimensionsJson: JSON.stringify({ width_mm: 53.98, height_mm: 85.60, dpi: 300 }),
        isDefault: true,
      },
    });
    console.log('Default template configuration created.');
  }
}
