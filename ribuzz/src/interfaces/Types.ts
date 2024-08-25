import IProduct from "./IProduct";


export interface ILoginProps {
    email: string;
    password: string;
}

export interface ILoginError {
    email?: string;
    password?: string;
}



export interface IRegisterProps {
    email: string;
    password: string;
    name: string;
    address: string;
    phone: string;
}

export type IRegisterError = Partial<IRegisterProps>



export interface IUserSession {
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



export interface IOrder  {
    id: number;
    status: string;
    date: Date;
    products: IProduct[];
}