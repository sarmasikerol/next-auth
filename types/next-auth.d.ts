// NextAuth için modül genişletme (module augmentation)
import NextAuth from "next-auth";

declare module "next-auth" {
  // Session nesnesinin tipini genişletme
  interface Session {
    // İsteğe bağlı erişim token'ı
    accessToken?: string;
    
    // Kullanıcı nesnesinin özelliklerini genişletme
    user: {
      // Kullanıcı rolleri dizisi
      roles?: string[];
      
      // Mevcut NextAuth kullanıcı özellikleri
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  // JWT (JSON Web Token) nesnesinin tipini genişletme
  interface JWT {
    // İsteğe bağlı erişim token'ı
    accessToken?: string;
    
    // Kullanıcı rolleri dizisi
    roles?: string[];
  }
}
