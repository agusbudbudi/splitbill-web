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
    // Default redirect callback drops the whole callbackUrl (path + ?redirect=
    // query) whenever its origin doesn't exactly string-match baseUrl. The
    // site is reachable on both the apex and www hosts, so a visitor who
    // starts the Google flow on one while baseUrl resolves to the other
    // (e.g. splitbill.my.id vs www.splitbill.my.id) would otherwise always
    // land on bare "/" after login, losing where they meant to go (e.g.
    // /split-later). Compare hostnames with "www." stripped instead.
    async redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl);
        const stripWww = (host: string) => host.replace(/^www\./, "");
        if (stripWww(target.hostname) === stripWww(new URL(baseUrl).hostname)) {
          return target.toString();
        }
      } catch {
        // fall through to baseUrl below
      }
      return baseUrl;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
});
