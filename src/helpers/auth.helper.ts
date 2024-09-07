import { /* ILoginProps,  */ILoginPropsEntrep, ILoginPropsUSer, IRegisterResponse, IUserSession } from "@/interfaces/types";
import { IRegisterProps } from "@/interfaces/types";


const APIURL = process.env.NEXT_PUBLIC_API_URL;


export async function register(registerData: IRegisterProps): Promise<IRegisterResponse> {
  try {
      const response = await fetch(`${APIURL}/users`, {
          method: 'POST',
          headers: {
              "Content-type": "application/json"
          },
          body: JSON.stringify(registerData)
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register');
      }

      const data: IRegisterResponse = await response.json();
      return data;
  } catch (error: any) {
      throw new Error(error.message);
  }
}


export async function loginUserH(userData: ILoginPropsUSer): Promise<IUserSession> {
  try {
    console.log('Datos de usuario a enviar:', userData); // Verificar datos de usuario

    const response = await fetch(`${APIURL}/auth/signIn/clients`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al iniciar sesión:', errorData); // Verificar datos del error
      throw new Error(errorData.message || 'Login failed');
    }

    const sessionData: IUserSession = await response.json();
    return sessionData;
  } catch (error: any) {
    console.error('Error en loginUserH:', error); // Verificar error
    throw new Error(error);
  }
}

export async function loginEntrepreneurH(userData: ILoginPropsEntrep): Promise<IUserSession> {
  try {
    console.log('Datos de emprendedor a enviar:', userData); // Verificar datos de emprendedor

    const response = await fetch(`${APIURL}/auth/signIn/entrepreneur`, {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al iniciar sesión:', errorData); // Verificar datos del error
      throw new Error(errorData.message || 'Login failed');
    }

    const sessionData: IUserSession = await response.json();
    return sessionData;
  } catch (error: any) {
    console.error('Error en loginEntrepreneurH:', error); // Verificar error
    throw new Error(error);
  }
}