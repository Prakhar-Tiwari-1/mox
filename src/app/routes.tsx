import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Calendar from "./pages/Calendar";
import Partnership from "./pages/Partnership";
import Contact from "./pages/Contact";
import Clubs from "./pages/Clubs";
import Programmes from "./pages/Programmes";
import XForum from "./pages/XForum";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "events", Component: Events },
      { path: "events/:eventId", Component: EventDetail },
      { path: "calendar", Component: Calendar },
      
      { path: "partnership", Component: Partnership },
      { path: "clubs", Component: Clubs },
      { path: "programmes", Component: Programmes },
      { path: "xforum", Component: XForum },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  }
])
