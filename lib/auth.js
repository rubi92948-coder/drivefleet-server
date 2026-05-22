import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("drivefleet");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: { enabled: true },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  baseURL: "http://localhost:5000",
  basePath: "/api/auth",
});