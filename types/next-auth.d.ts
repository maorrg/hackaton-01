import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "./role";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role & DefaultUser;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role: Role;
  }
}
