import { NAVIGATION_DATA } from "../../../utils/constant";
import NavigationItem from "./NavigationItem";

function Navigation() {
  return (
    <ul className="nc-Navigation flex items-center">
      {NAVIGATION_DATA.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
