import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  if (process.env.NODE_ENV === 'production') throw new Error('Seeding is disabled in production');
  const passwordHash = await bcrypt.hash('Development123!', 12);
  await prisma.user.upsert({ where: { email: 'demo@cinevo.local' }, update: {}, create: { name: 'Demo User', email: 'demo@cinevo.local', passwordHash } });
}
main().finally(() => prisma.$disconnect());
