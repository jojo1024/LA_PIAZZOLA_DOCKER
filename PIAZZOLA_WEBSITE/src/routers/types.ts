import { ComponentType } from "react";

export interface LocationStates {
  "/"?: {};
  "/authentification"?: {};
  "/enregistrement"?: {};
  "/panier"?: {};
  "/contact"?: {};
  "/fidelite"?: {};
  "/contenu"?: {};
  "/menu"?: {};
  "/pizzas"?: {}; 
  "/restaurant"?: {};
  "/compte"?: {};
  "/mes-commandes"?: {};
  "/changer-mot-de-passe"?: {};
  "/mentions-legales"?: {};
  "/conditions-generales-de-vente"?: {};
  "/conditions-generales-d-utilisation"?: {};
  "/reinitialiser-mot-de-passe"?: {};
}

export type PathName = keyof LocationStates;

export interface Page {
  path: PathName;
  component: ComponentType<Object>;
}

export interface CustomLink {
  label: string;
  href: string;
  targetBlank?: boolean;
}