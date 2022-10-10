import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"],
});

async function main() {
  // optional user
  const firstUser = await prisma.user.findFirst();

  console.log(firstUser?.id);

  // required user
  const firstUser2 = await prisma.user.findFirstOrThrow({
    select: {
      name: true,
    },
  });

  console.log(firstUser2.name);

  // relations
  const alice = await prisma.user.findFirstOrThrow({
    include: {
      posts: true,
      profile: true,
    },
    where: {
      name: {
        startsWith: "A",
      },
    },
  });

  console.log(alice.profile?.bio);
  console.log(alice.posts[0].title);
}

main().catch(e => {
  console.log("Error: ", e);
});
