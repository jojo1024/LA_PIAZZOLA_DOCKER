// import { getServerUrl } from "./functions";
// console.log("🚀 ~ file: apiClient.ts:2 ~ getServerUrl:", getServerUrl())

import { BASE_URL, isDev } from "./constant";
// import { decryptPayload, encryptPayload } from "./functions";


export interface IServerResponse {
  status: number;
  data?: any;
  error?: any
  errors?: any
}

const origin = isDev ? "" : "web-client"

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

  // console.log("🚀 ~ res.data:::::::::::::::::::::::", res)
 
  return res;

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
    request<IServerResponse>(route, url, {
      // credentials: "include", 
      headers: {
        "request-origin": origin
      }
    }),

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
        // body: JSON.stringify(payload),
        body: JSON.stringify( payload ),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "request-origin": origin
        },
      }),

}
