import NextAuth, { getServerSession, NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook";
import { connectToDatabase } from "./connect"
import User from "../database/models/user.model";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from '../db'

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin:Boolean;
    }
  }
}

declare module "next-auth/jwt"{
  interface JWT{
    
      isAdmin:Boolean;
    
  }
}
var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');


export const authOptions:NextAuthOptions = {
    // Configure one or more authentication providers
    
   
    session:{
    strategy:"jwt"
},
    providers: [
      GoogleProvider({
        clientId: process.env.CLIENT_ID!,
        clientSecret: process.env.CLIENT_SECRET!,
        httpOptions: {
          timeout: 10000, // 10 seconds
        },
      
      
      }),

      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        httpOptions: {
          timeout: 10000, // 10 seconds
        },
      }),

        EmailProvider({
          server: process.env.EMAIL_SERVER,
          from: process.env.EMAIL_FROM,
          sendVerificationRequest({
            identifier: email,
            url,
            provider: { server, from },
          }) {
            const transporter = nodemailer.createTransport(server);
            const mailOptions = {
              to: email,
              from,
              subject: 'Verify your email',
              text: `Please click the following link to verify your email: ${url}`,
              html: `<a href="${url}">Verify your email</a>`,
            };

            return transporter.sendMail(mailOptions)
              .then(() => {
                console.log('Verification email sent successfully');
              })
              .catch((error:any) => {
                console.error('Error sending verification email:', error);
                throw new Error('Error sending verification email');
              });
          },
      }),
    
      
      
      // ...add more providers here
    ],
    adapter: MongoDBAdapter(client),
    callbacks:{
      async session({token, session}) {
        if(token){
          session.user.isAdmin = Boolean(token.isAdmin)
        }
        return session
      },
      async jwt({token}) {
        await connectToDatabase();
        const userInDb = await User.findOne({
          email:token.email!
        })
        token.isAdmin=userInDb?.isAdmin!
        return token
       
        },
      async signIn({ user, account, profile }) {
        try {
          await connectToDatabase();
          
          // Check if user already exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user if doesn't exist
            await User.create({
              email: user.email,
              name: user.name,
              isAdmin: false,
              city:"pending",
              country:"pending",
              street:"pending",
              phoneNumber:"000 000 000" // Set default admin status

            });
          }
          
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
    }
  }
  
  export const getAuthSession = () => getServerSession(authOptions)
