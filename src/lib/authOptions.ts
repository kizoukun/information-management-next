import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
const bcrypt = require("bcrypt");
import { db } from "@/lib/db";

interface Credentials extends Record<"email" | "password", string> {}

export const authOptions: NextAuthOptions = {
   session: {
      strategy: "jwt",
   },
   providers: [
      CredentialsProvider({
         id: "credentials",
         name: "Credentials",
         // @ts-ignore
         async authorize(credentials: Credentials): Promise<any> {
            const user = await db.user.findFirst({
               where: {
                  email: credentials.email,
               },
            });
            if (!user) {
               throw new Error("Email atau password salah");
            }
            const comparePassword = await bcrypt.compare(
               credentials.password,
               user.password
            );
            if (!comparePassword) {
               throw new Error("Email atau password salah");
            }
            return user;
         },
      }),
   ],
   callbacks: {
      async session({ token, session }) {
         if (token) {
            session.user = token;
         }
         return session;
      },
      // @ts-ignore
      async jwt({ token, user }) {
         const dbUser = await db.user.findFirst({
            where: {
               // @ts-ignore
               email: token.email,
            },
         });
         if (!dbUser) {
            return "/auth/login";
         }

         return {
            id: dbUser.id,
            email: dbUser.email,
            firstName: dbUser.firstName,
            lastName: dbUser.lastName,
            updatedAt: dbUser.updatedAt,
            createdAt: dbUser.createdAt,
         };
      },
   },
   pages: {
      error: "/auth/login",
   },
};
