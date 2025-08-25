import React from 'react'
import Site from './Site'
import PointLivraison from './PointLivraison'
import Banniere from './Banniere'
import Contact from './Contact'
import Video from './Video'
import Accompagnement from './Accompagnement'

const GestionSite = () => {
  return (
    <div>
      <Site />
      <Video />
      <Accompagnement />
      <PointLivraison />
      <Banniere />
      <Contact />
    </div>
  )
}

export default GestionSite