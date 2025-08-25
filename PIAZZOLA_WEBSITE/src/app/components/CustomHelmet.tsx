import React from 'react'
import { Helmet } from 'react-helmet-async';

interface CustomHelmetProps {
    title?: string;
    content?: string;
}
const CustomHelmet:React.FC<CustomHelmetProps> = (
  {
    title = "Piazzola | Pizzas authentiques et savoureuses - Livraison rapide", 
    content= "Découvrez Piazzola : des pizzas authentiques, artisanales et préparées avec des ingrédients frais. Commandez en ligne et profitez d'une livraison rapide et fiable dès aujourd'hui !"}) => {
    return (
        <Helmet>
        <title>{title}</title>
        <meta
          name="description"
          content={content}
        />
      </Helmet>
    )
}

export default CustomHelmet