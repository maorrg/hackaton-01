import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../utils/prisma";
import { Role } from "../../../types/role";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.provider === "google") {
        const userDB = await prisma.user.findUnique({
          where: {
            email: user.email!,
          },
          select: {
            id: true,
            accounts: true,
          },
        });
        if (userDB?.accounts.length === 1) return true;
        if (userDB) {
          await prisma.account.create({
            data: {
              userId: userDB.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });
          await prisma.user.update({
            where: { email: user.email! },
            data: { image: user.image, name: user.name },
          });
          return true;
        }
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
