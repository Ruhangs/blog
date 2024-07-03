import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { PATHS } from '@/constants';
import { userAuthSchema } from '@/lib/userAuth';

import { prisma } from './prisma';

async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    throw new Error('Failed to fetch user.');
  }
}

export const { handlers, auth, signOut, signIn } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // 解决这个错误：Error: PrismaClient is not configured to run in Vercel Edge Functions or Edge Middleware.
  // 参考：https://github.com/prisma/prisma/issues/21310#issuecomment-1840428931
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  trustHost: true,
  providers: [
    // 允许多个account关联同一个user（email相同）
    GithubProvider({ allowDangerousEmailAccountLinking: true }),
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const parsedCredentials = userAuthSchema.safeParse(credentials);
          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
            if (!user) throw new Error('用户未注册');
            const passwordsMatch = password === user.password;
            if (!passwordsMatch) {
              throw new Error('密码错误');
            }
            return user;
          }
          throw new Error('表单解析错误，请联系管理员');
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: PATHS.AUTH_SIGNIN,
  },
  secret: 'ESiKbu1UwIggBcoyy8GRn0xGMJjp9eoR7ntk2d4etys=',
  callbacks: {
    session({ session, token }) {
      if (session.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    authorized({ request, auth }) {
      // 将来用作 Next.js middleware，如果是访问后台页面，校验是否登录
      if (request.nextUrl.pathname.startsWith(PATHS.ADMIN_HOME)) {
        return !!auth?.user;
      }
      // 其它路径直接放行
      return true;
    },
  },
});
