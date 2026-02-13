/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import AvatarScanner from './pages/AvatarScanner';
import BeautyCoin from './pages/BeautyCoin';
import Benefits from './pages/Benefits';
import CardPortal from './pages/CardPortal';
import ClubePlus from './pages/ClubePlus';
import Contact from './pages/Contact';
import Control from './pages/Control';
import DrBeleza from './pages/DrBeleza';
import EdBeauty from './pages/EdBeauty';
import EdBeautyCreateContent from './pages/EdBeautyCreateContent';
import EdBeautyEditContent from './pages/EdBeautyEditContent';
import EdBeautyPlans from './pages/EdBeautyPlans';
import EdBeautyUpload from './pages/EdBeautyUpload';
import Eventos from './pages/Eventos';
import GoldenDoctors from './pages/GoldenDoctors';
import Home from './pages/Home';
import Join from './pages/Join';
import MapaDaEstetica from './pages/MapaDaEstetica';
import MapaInterativo from './pages/MapaInterativo';
import MyPlan from './pages/MyPlan';
import MyProfile from './pages/MyProfile';
import News from './pages/News';
import Plans from './pages/Plans';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Products from './pages/Products';
import TermsOfService from './pages/TermsOfService';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "AvatarScanner": AvatarScanner,
    "BeautyCoin": BeautyCoin,
    "Benefits": Benefits,
    "CardPortal": CardPortal,
    "ClubePlus": ClubePlus,
    "Contact": Contact,
    "Control": Control,
    "DrBeleza": DrBeleza,
    "EdBeauty": EdBeauty,
    "EdBeautyCreateContent": EdBeautyCreateContent,
    "EdBeautyEditContent": EdBeautyEditContent,
    "EdBeautyPlans": EdBeautyPlans,
    "EdBeautyUpload": EdBeautyUpload,
    "Eventos": Eventos,
    "GoldenDoctors": GoldenDoctors,
    "Home": Home,
    "Join": Join,
    "MapaDaEstetica": MapaDaEstetica,
    "MapaInterativo": MapaInterativo,
    "MyPlan": MyPlan,
    "MyProfile": MyProfile,
    "News": News,
    "Plans": Plans,
    "PrivacyPolicy": PrivacyPolicy,
    "Products": Products,
    "TermsOfService": TermsOfService,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};