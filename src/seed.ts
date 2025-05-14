import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const testUsers = [
    {
      username: "testuser1",
      email: "test1@example.com",
      password: await hash("password123", 12),
      image: "https://i.imgur.com/HeIi0wU.png",
    },
    {
      username: "testuser2",
      email: "test2@example.com",
      password: await hash("password123", 12),
      image: "https://i.imgur.com/HeIi0wU.png",
    },
    {
      username: "googleuser",
      email: "google@example.com",
      password: null,
      image: "https://i.imgur.com/HeIi0wU.png",
    },
  ];

  // Upsert users (create if not exists)
  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        username: user.username,
        email: user.email,
        password: user.password,
        image: user.image,
        emailVerified: new Date(),
      },
    });
  }

  console.log("Seeded test users successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
