import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    //invoked on succesful sign in
    async signIn({ profile }) {
      //1. Connect to Database
      await connectDB();
      //2. check if user exist
      const UserExists = await User.findOne({ email: profile.email });
      //3. if user does not exist, create user
      if (!UserExists) {
        //Truncate User Name if too long
        const username = profile.name.slice(0, 20);
        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      //4. Return True to allow sign in
      return true;
    },
    //session callback function that modifies the session object
    async succession({ session }) {
      //1. Get User from database
      const user = await User.findOne({ email: session.user.email });
      //2. Assign the User id from the session
      session.user.id = user._id.toString();
      //3. Return succession
      return session;
    },
  },
};
