import { ApolloServer, gql } from "apollo-server";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

import { Post, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});
let numberOfQueries = 0;
prisma.$on("query", e => {
  numberOfQueries++;
});

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    id: ID!
    email: String!
    name: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String
    published: Boolean!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    content: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    users: [User]
  }
`;

const resolvers = {
  Query: {
    users: () => prisma.user.findMany(),
  },
  User: {
    posts(parent: User) {
      return prisma.post.findMany({ where: { authorId: parent.id } });
      // return prisma.user.findUnique({ where: { id: parent.id } }).posts();
    },
  },
  Post: {
    comments(parent: Post) {
      return prisma.comment.findMany({ where: { postId: parent.id } });
      // return prisma.post.findUnique({ where: { id: parent.id } }).comments();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  /**
   * What's up with this embed: true option?
   * These are our recommended settings for using AS;
   * they aren't the defaults in AS3 for backwards-compatibility reasons but
   * will be the defaults in AS4. For production environments, use
   * ApolloServerPluginLandingPageProductionDefault instead.
   **/
  plugins: [
    {
      async requestDidStart(requestContext) {
        if (requestContext.request.operationName === "IntrospectionQuery") {
          return {};
        }

        const numberOfQueriesBefore = numberOfQueries;

        return {
          async willSendResponse(requestContext) {
            const queryCount = numberOfQueries - numberOfQueriesBefore;

            if (queryCount > 0) {
              console.log(`Performed ${queryCount} queries`);
            }
          },
        };
      },
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
