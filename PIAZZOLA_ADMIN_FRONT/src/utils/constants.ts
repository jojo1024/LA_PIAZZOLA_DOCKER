export const base = ''
export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

export const BASE_URL_PROD: string = "https://admin.la-piazzola.com"
export const BASE_URL: string = window.location.origin
// export const BASE_URL: string = isDev ? "http://127.0.0.1:50001" : BASE_URL_PROD
// export const BASE_URL: string = isDev ? "http://192.168.100.4:50001" : BASE_URL_PROD
// export const BASE_URL: string = !process.env.NODE_ENV || process.env.NODE_ENV === "development" ? "http://192.168.1.56:49501" : window.location.origin;

export const sessionId = "zokdzokdpo@fddgtghhiudfsd"

export const MAX_INACTIVITY_TIME = 1000 * 60 * 30; // 10 minutes

export const choixViandeData = ["avecJambon", "avecCharcuterie", "avecChoriso"]

export const choixViandeitem = {
  "avecJambon": "Jambon",
  "avecCharcuterie": "Charcuterie",
  "avecChoriso": "Chorizo",
}