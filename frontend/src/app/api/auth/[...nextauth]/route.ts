import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt' as 'jwt'
    },
    pages: {
        signIn: "/auth/login",
        error: "/error",
        signOut: "/"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                user: { label: "Usuario", type: "text", placeholder: "" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) throw new Error("No credentials provided");

                const url = `http://localhost:5000/api/validarUsuario?usuario=${credentials.user}`;
                
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new Error("User not found");
                    
                    const user = (await response.json())[0];
                    
                    // Verificación de la contraseña
                    console.log(bcrypt.hash(user.password,10));
                    const matchPassword = bcrypt.compareSync(credentials.password.trim(), user.password.trim());
                    if (!matchPassword) throw new Error("Password mismatch");

                    // Retorna el objeto de usuario para la sesión
                    return {
                        id: user.id_persona,
                        name: `${user.id_persona} ${user.usuario} `,
                        email: user.rol,
                        
                    };
                    
                } catch (error) {
                    console.log(error);
                    throw new Error("Error en la autenticación");
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }: { session: any, token: any }) {
            if (token) session.user = { id: token.sub, name: token.name,email: token.email,image: token.image };
            return session;
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
