
import { BASE_URL, isDev } from "./constants";
import { decryptPayload, encryptPayload } from "./functions";


export interface IServerResponse {
  status: number;
  data?: any;
  error?: any
  errors?: any
}

export async function request<T>(
  route: string,
  url?: string,
  config?: RequestInit,
): Promise<T> {
  const API_URL: string = BASE_URL
  const myUrl: string =
    url === undefined
      ? `${API_URL}${route}`
      : `${url}${route}`
  const response = await fetch(myUrl, config);
  const res: any = await response.json();
  const newData = {
    ...res,
    data: res?.data ? decryptPayload(res?.data) : null,
  };
  console.log("🚀 ~ newData:>>>>>>>>>>>>", newData)
  return newData;
}

export const apiClient = {
  /**
   * Effectue un GET vers le serveur et renvoi la réponse en Json
   * {status:number; data?:any; error?: any}
   * @param route obligatoire 
   * @param url   optional 
   * @returns IServerResponse
   */
  get: (route: string, url?: string) =>
    request<IServerResponse>(route, url),

  /**
   * Effectue un POST vers le serveur et renvoi la réponse en Json
   * {status:number; data?:any; error?: any}
   * @param route :string
   * @param payload : object
   * @returns IServerResponses
   */
  post: (route: string, payload: any) =>
    request<IServerResponse>(
      route,
      undefined,
      {
        method: 'POST',
        body: JSON.stringify({ data: encryptPayload(payload) }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),

  put: (route: string, payload: any) =>
    request<IServerResponse>(
      route,
      undefined,
      {
        method: 'PUT',
        body: JSON.stringify(isDev ? payload : { data: encryptPayload(payload) }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),

  delete: (route: string, payload: any) =>
    request<IServerResponse>(
      route,
      undefined,
      {
        method: 'DELETE',
        body: JSON.stringify(isDev ? payload : { data: encryptPayload(payload) }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }),

}
