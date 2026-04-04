import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL! });

const USERNAME = process.argv[2] ?? "admin";
const PASSWORD = process.argv[3] ?? "admin123";

async function main() {
  const existing = await prisma.adminUser.findUnique({ where: { username: USERNAME } });

  if (existing) {
    console.log(`User "${USERNAME}" already exists. Updating password...`);
    await prisma.adminUser.update({
      where: { username: USERNAME },
      data: { passwordHash: hashSync(PASSWORD, 12) },
    });
    console.log(`Password updated for "${USERNAME}".`);
  } else {
    await prisma.adminUser.create({
      data: { username: USERNAME, passwordHash: hashSync(PASSWORD, 12) },
    });
    console.log(`Admin user "${USERNAME}" created with password "${PASSWORD}".`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
