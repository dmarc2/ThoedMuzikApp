import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import Muzik from './pages/Muzik.js';
import SongPage from './pages/songPage.js';
import SignInPage from './pages/signInPage.js';
import SignUpPage from './pages/signUpPage.js';
import TapeIndex from './pages/tape-index.js';
import ArtistIndex from './pages/artist-index.js';
import Artist from './pages/artist.js';
import About from './pages/about.js';
import Profile from './pages/profile.js';
import AdminPanel from './pages/adminPanel.js';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { param } from 'jquery';

const router = createBrowserRouter([
  {
    path: "*",
    element: <div>Not found</div>
  },
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/signin",
    element: <SignInPage/>
  },
  {
    path: "/signup",
    element: <SignUpPage/>
  },
  {
    path: "/profile",
    element: <Profile/>
  },
  {
    path: "/adminPanel",
    element: <AdminPanel/>
  },
  {
    path: "/muzik",
    element: <Muzik/>
  },
  {
    path: "/muzik/songs/:songId",
    element: <SongPage songId={param.songId}/>
  },
  {
    path: "/muzik/tapes/:tapeType/:tapeId",
    element: <TapeIndex tapeType={param.tapeType} tapeId={param.tapeId}/>
  },
  {
    path: "/artists",
    element: <ArtistIndex/>
  },
  {
    path: "/artist/:name",
    element: <Artist/>
  },
  {
    path: "/about",
    element: <About/>
  },
  {
    path: "/shop",
    element: <h1>Shop Page</h1>
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
