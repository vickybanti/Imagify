import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { connectToDatabase } from "./connect";
import User from "../database/models/user.model";
import client from "../db";
import nodemailer from "nodemailer";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      firstName?: string | null;
      lastName?: string | null;
      photo?: string | null;
      name?: string | null;
      accessToken?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean;
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000,
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000,
      },
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
      sendVerificationRequest({ identifier: email, url, provider: { server, from } }) {
        const transporter = nodemailer.createTransport(server);
        const mailOptions = {
          to: email,
          from,
          subject: "Verify your email",
          text: `Please click the following link to verify your email: ${url}`,
          html: `<a href="${url}">Verify your email</a>`,
        };

        return transporter
          .sendMail(mailOptions)
          .then(() => {
            console.log("Verification email sent successfully");
          })
          .catch((error) => {
            console.error("Error sending verification email:", error);
            throw new Error("Error sending verification email");
          });
      },
    }),
  ],
  adapter: MongoDBAdapter(client),
  callbacks: {
    async session({ session, token }) {
      console.log(token)
      console.log(session)
      if (token?.accessToken) {
        session.user.accessToken = token.accessToken;
      session.user.firstName = token.firstName as string | null;
      session.user.lastName = token.lastName as string | null;
      session.user.photo = token.photo as string | null;
      session.user.name = token.userName as string | null;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;

        try {
          await connectToDatabase();
          const userInDb = await User.findOne({ email: token.email! });
          token.isAdmin = userInDb?.isAdmin || false;
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      return token;
    },
    async signIn({ user }) {
      try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            photo: user.image!,
            userName: user.name!,
            isAdmin: false,
            city: "pending",
            country: "pending",
            street: "pending",
            phoneNumber: "000 000 000",
          });
        }
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
