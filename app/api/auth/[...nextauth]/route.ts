import NextAuth, { NextAuthOptions, User, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

interface AuthUser extends User {
  email: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error("Email and OTP are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");

        if (!user.otp || !user.otpExpires || new Date() > user.otpExpires) {
          throw new Error("OTP expired or invalid");
        }

        const isOtpValid = await bcrypt.compare(credentials.otp, user.otp);
        if (!isOtpValid) throw new Error("Invalid OTP");

        await prisma.user.update({
          where: { email: credentials.email },
          data: { otp: null, otpExpires: null },
        });

        return { email: user.email } as AuthUser;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.email) {
        session.user = { ...session.user, email: token.email };
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: AuthUser }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/pages/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
