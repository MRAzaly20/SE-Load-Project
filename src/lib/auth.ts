import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export const hashPassword = async (password: string): Promise<string> => {
  if (typeof password !== "string") {
    throw new Error("Password must be a string");
  }
  const saltRounds = 12;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
};

export const verifyPassword = async (
  password: string,
  hashedPassword?: string | null
): Promise<boolean> => {
  if (!hashedPassword) return false;
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error verifying password:", error);
    throw new Error("Failed to verify password");
  }
};

export const createToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "default_jwt_secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "default_jwt_secret";
  try {
    return jwt.verify(token, secret);
  } catch (error: any) {
    console.error("Error verifying JWT:", error.message);
    throw new Error("Invalid or expired token");
  }
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        provider: { label: "Provider", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials) return null;

          const { username, email, password } = credentials;
          const cleanUser = (username || email || "").trim().toLowerCase();

          // Find user in PostgreSQL via Prisma (by email or username handle)
          const targetEmail = cleanUser.includes("@") ? cleanUser : `${cleanUser}@se.com`;
          const user = await prisma.user.findUnique({
            where: { email: targetEmail },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
            employeeCode: user.employeeCode,
            avatar: user.avatar || user.image,
            authProvider: "credentials",
          } as any;
        } catch (error) {
          console.error("Authorize error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.authProvider = account.provider;
      }
      if (user) {
        token.id = user.id;
        token.name = user.name || token.name;
        token.email = user.email || token.email;
        token.role = (user as any).role || token.role || "engineer";
        token.department = (user as any).department || token.department || "Schneider Electric Field Engineering";
        token.employeeCode = (user as any).employeeCode || (user as any).employee_code || token.employeeCode || null;
        token.avatar = (user as any).avatar || user.image || token.avatar || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).name = token.name;
        (session.user as any).email = token.email;
        (session.user as any).role = token.role;
        (session.user as any).department = token.department;
        (session.user as any).employee_code = token.employeeCode;
        (session.user as any).employeeCode = token.employeeCode;
        (session.user as any).avatar = token.avatar;
        (session.user as any).authProvider = token.authProvider;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.type === "oauth" && user.email) {
        try {
          const updatedUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name || undefined,
              image: user.image || undefined,
              avatar: user.image || undefined,
            },
            create: {
              email: user.email,
              name: user.name || "Schneider User",
              image: user.image || undefined,
              avatar: user.image || undefined,
              role: "engineer",
              department: "Schneider Electric Field Engineering",
            },
          });

          // Link account if needed
          const existingAccount = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!existingAccount) {
            console.log(
              `Linking OAuth account ${account.provider}:${account.providerAccountId} to existing user ${updatedUser.id}`
            );
            await prisma.account.create({
              data: {
                userId: updatedUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token ?? null,
                access_token: account.access_token ?? null,
                expires_at: account.expires_at ?? null,
                token_type: account.token_type ?? null,
                scope: account.scope ?? null,
                id_token: account.id_token ?? null,
                session_state: (account.session_state as string) ?? null,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return true;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
