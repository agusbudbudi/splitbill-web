import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      console.log("[NextAuth Callback] jwt - account provider:", account?.provider);
      // Store Google ID Token in the JWT payload
      if (account) {
        console.log("[NextAuth Callback] jwt - account has id_token:", !!account.id_token);
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      console.log("[NextAuth Callback] session - token has idToken:", !!token?.idToken);
      // Pass the ID Token to the client-side session object
      if (token) {
        session.idToken = token.idToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
