import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

type User = {
   id: UserId;
   email: string;
   firstName: string;
   lastName: string;
   updatedAt: Date;
   createdAt: Date;
};

declare module "next-auth" {
   interface Session {
      user: User;
   }
}

declare module "next-auth/jwt" {
   interface JWT extends User {}
}
