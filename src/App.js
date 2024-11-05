import './App.css';
import React from 'react';
import HomeProduct from "../src/component/products/HomeProduct";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeCategories from "../src/component/categories/HomeCategories";
import Sidebar from './page/Sidebar';



function App() {
  return (
      <>
        <BrowserRouter>
          <div className="container mt-4">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

            </nav>
            <Sidebar />

            <Routes>
              <Route path="/product" element={<HomeProduct/>}/>
              <Route path="/categories" element={<HomeCategories/>}/>
            </Routes>
          </div>
        </BrowserRouter>
        <ToastContainer/>

      </>
  )
}

export default App;
