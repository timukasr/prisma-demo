import { PrismaClient, User, Post, Prisma } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const amountOfUsers = 10;
const amountOfPostPerUser = 10;
const amountOfCommentsPerPost = 10;

async function main() {
  await prisma.user.deleteMany({}); // use with caution.

  const userData: User[] = [];
  const postsData: Post[] = [];
  const commentsData: Prisma.CommentCreateManyInput[] = [];

  for (let i = 0; i < amountOfUsers; i++) {
    const userId = i + 1;
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    userData.push({
      id: i + 1,
      email: faker.internet.email(firstName, lastName),
      name: `${firstName} ${lastName}`,
    });

    for (let j = 0; j < amountOfPostPerUser; j++) {
      const postId = i * amountOfPostPerUser + j + 1;
      postsData.push({
        id: postId,
        authorId: userId,
        title: faker.lorem.sentence().slice(0, 191),
        content: faker.lorem.sentences(),
        published: faker.datatype.boolean(),
      });

      for (let k = 0; k < amountOfCommentsPerPost; k++) {
        commentsData.push({
          postId,
          authorId: (k % 10) + 1,
          content: faker.lorem.sentences(),
        });
      }
    }
  }

  const result = await prisma.$transaction([
    prisma.user.createMany({ data: userData }),
    prisma.post.createMany({ data: postsData }),
    prisma.comment.createMany({ data: commentsData }),
  ]);

  console.log(result);
}

main().catch(e => {
  console.error(e);
  // process.exit(1);
});
// .finally(async () => {
//   await prisma.$disconnect();
// });
