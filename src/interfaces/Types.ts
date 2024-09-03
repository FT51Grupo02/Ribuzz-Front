import IProduct from "./IProduct";


export interface ILoginPropsUSer {
    email: string;
    password: string;
}

export interface ILoginPropsEntrep {
    email: string;
    password: string;
}

export interface ILoginError {
    email?: string;
    password?: string;
}


export interface IRegisterProps {
    name: string;
    email: string;
    password: string;
    date: Date;
    rol: UserRole; // Hacerlo opcional si el rol no siempre es requerido
}

export type UserRole = 'entrepreneur' | 'client' | 'admin';


export type IRegisterError = Partial<IRegisterProps>


    export interface IRegisterResponse {
        id: string;
        name: string;
        email: string;
        date: string;
        photo: string | null;
    }

    export interface IUserSession {
        token: string;  // Token JWT
        user: IUser;    // Usuario autenticado
    }
    
    // Definición de IUser
    export interface IUser {
        id: string;
        name: string;
        email: string;
        date: string;
        photo: string | null;
    }
/*  export interface IUserSession {
    token: string;
    user: {
        address: string;
        email: string;
        id: number;
        name: string;
        phone: string;
        role: string;
        orders: []
    }
} 
 */
export interface IOrder  {
    id: number;
    status: string;
    date: Date;
    products: IProduct[];
}

