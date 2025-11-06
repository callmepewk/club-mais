import Home from './pages/Home';
import Benefits from './pages/Benefits';
import Join from './pages/Join';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Benefits": Benefits,
    "Join": Join,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};