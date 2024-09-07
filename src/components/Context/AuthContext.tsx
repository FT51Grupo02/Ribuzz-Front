'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { IUser, IRegisterProps, IRegisterResponse, ILoginPropsUSer, ILoginPropsEntrep } from "@/interfaces/types";
import { loginEntrepreneurH as authLoginE, loginUserH as authLoginU, register as authRegister } from "@/helpers/auth.helper";
import { getAuthenticatedUser } from "@/helpers/user.helper";

export interface AuthContextProps {
    token: string | null;
    user: IUser | null;
    setToken: (token: string | null) => void;
    setUser: (user: IUser | null) => void;
    loginEntrepeneurE: (loginData: ILoginPropsEntrep) => Promise<boolean>;
    loginUserC: (loginData: ILoginPropsUSer) => Promise<boolean>;
    logout: () => void;
    register: (registerData: IRegisterProps) => Promise<IRegisterResponse | null>;
}

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    setToken: () => { throw new Error("setToken no inicializado"); },
    setUser: () => { throw new Error("setUser no inicializado"); },
    loginEntrepeneurE: async () => { throw new Error("login no inicializado"); },
    loginUserC: async () => { throw new Error("login no inicializado"); },
    logout: () => { throw new Error("logout no inicializado"); },
    register: async () => { throw new Error("register no inicializado"); },
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        }
    }, [token]);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const authenticatedUser = await getAuthenticatedUser(token);
                    if (authenticatedUser) {
                        setUser(authenticatedUser);
                        localStorage.setItem('userId', authenticatedUser.id);
                        localStorage.setItem('userFullName', authenticatedUser.name);
                    } else {
                        console.error('El usuario autenticado es null');
                    }
                } catch (error) {
                    console.error('Error al obtener el usuario autenticado:', error);
                }
            }
        };
        fetchUserData();
    }, [token]);

    const loginEntrepeneurE = async (userData: ILoginPropsEntrep): Promise<boolean> => {
        try {
            const sessionData = await authLoginE(userData);
            setToken(sessionData.token);
            setUser(sessionData.user);
            return true;
        } catch (error) {
            console.error("Error en el login", error);
            return false;
        }
    };

    const loginUserC = async (userData: ILoginPropsUSer): Promise<boolean> => {
        try {
            const sessionData = await authLoginU(userData);
            setToken(sessionData.token);
            setUser(sessionData.user);
            return true;
        } catch (error) {
            console.error("Error en el login", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        const token = localStorage.getItem('authToken');
        if (token) {
            localStorage.removeItem(`cart_${token}`);
        }
    };

    const register = async (registerData: IRegisterProps): Promise<IRegisterResponse | null> => {
        try {
            const userData = await authRegister(registerData);
            console.log('Datos del usuario registrado:', userData);
            return userData;
        } catch (error) {
            console.error("Error en el registro", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, setToken, setUser, loginEntrepeneurE, loginUserC, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);