import Home from './pages/Home';
import Benefits from './pages/Benefits';
import Join from './pages/Join';
import About from './pages/About';
import Products from './pages/Products';
import GoldenDoctors from './pages/GoldenDoctors';
import News from './pages/News';
import Contact from './pages/Contact';
import ClubePlus from './pages/ClubePlus';
import DrBeleza from './pages/DrBeleza';
import MapaDaEstetica from './pages/MapaDaEstetica';
import BeautyCoin from './pages/BeautyCoin';
import MapaInterativo from './pages/MapaInterativo';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Benefits": Benefits,
    "Join": Join,
    "About": About,
    "Products": Products,
    "GoldenDoctors": GoldenDoctors,
    "News": News,
    "Contact": Contact,
    "ClubePlus": ClubePlus,
    "DrBeleza": DrBeleza,
    "MapaDaEstetica": MapaDaEstetica,
    "BeautyCoin": BeautyCoin,
    "MapaInterativo": MapaInterativo,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};