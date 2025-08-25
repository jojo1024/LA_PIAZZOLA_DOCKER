import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CustomHelmet from './app/components/CustomHelmet';
import MyRoutes from './routers';

function App() {

  return (
    <GoogleOAuthProvider clientId="781495524688-tbnluq5jkggc1vrqkkpobqmfiqj1d195.apps.googleusercontent.com">
      <HelmetProvider>
        <CustomHelmet />
        <MyRoutes />
      </HelmetProvider>
    </GoogleOAuthProvider>
  )
}

export default App
