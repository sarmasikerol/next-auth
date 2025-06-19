import NextAuth, { NextAuthOptions, User } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { jwtDecode } from 'jwt-decode';

// Custom types
interface CustomUser extends User {
  'https://myapp.example.com/roles'?: string[];
  roles?: string[];
  app_metadata?: {
    roles?: string[];
  };
  user_metadata?: {
    roles?: string[];
  };
}

interface CustomToken extends JWT {
  roles?: string[];
}

interface CustomSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[];
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
      authorization: {
        params: {
          audience: process.env.AUTH0_AUDIENCE,
          scope: "openid profile email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<CustomToken> {
        console.log('=== JWT CALLBACK DEBUG ===');
        
        if (user && account) {
          console.log('Processing initial login...');
          
          // ID token'dan rolleri çıkar
          if (account.id_token) {
            try {
              const decodedToken = jwtDecode(account.id_token) as any;
              console.log('Decoded ID token:', decodedToken);
              
              const roles = decodedToken['https://myapp.example.com/roles'];
              if (roles && Array.isArray(roles)) {
                token.roles = roles;
                console.log('✅ Roles extracted from ID token:', roles);
              }
            } catch (error) {
              console.error('Error decoding ID token:', error);
            }
          }
          
          // Access token'dan da deneyelim
          if (account.access_token && !token.roles) {
            try {
              const decodedAccessToken = jwtDecode(account.access_token) as any;
              console.log('Decoded Access token:', decodedAccessToken);
              
              const roles = decodedAccessToken['https://myapp.example.com/roles'];
              if (roles && Array.isArray(roles)) {
                token.roles = roles;
                console.log('✅ Roles extracted from Access token:', roles);
              }
            } catch (error) {
              console.error('Error decoding Access token:', error);
            }
          }
        }
        
        // Default roles
        if (!token.roles) {
          token.roles = ['user'];
        }
        
        console.log('Final token roles:', token.roles);
        console.log('=== JWT CALLBACK END ===');
        return token as CustomToken;
      },
    
    async session({ session, token }): Promise<CustomSession> {
      console.log('=== SESSION CALLBACK DEBUG ===');
      console.log('Token roles:', token.roles);
      
      const customSession = session as CustomSession;
      customSession.user.roles = (token as CustomToken).roles || ['user'];
      
      console.log('Final session roles:', customSession.user.roles);
      console.log('=== SESSION CALLBACK END ===');
      
      return customSession;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);