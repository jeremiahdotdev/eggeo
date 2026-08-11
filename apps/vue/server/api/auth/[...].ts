import { NuxtAuthHandler } from '#auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@eggeo/db';
import { authCredentialsSchema } from '@eggeo/validation';

const config = useRuntimeConfig();

export default NuxtAuthHandler({
  secret: config.authSecret,
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = authCredentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: parsed.data.email.toLowerCase(),
          },
        });

        if (!user) {
          return null;
        }

        if (!user.passwordHash) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.username,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },
  },
});
