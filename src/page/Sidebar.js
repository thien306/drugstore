import React, { useState } from 'react';
import '../style/Sidebar.css';
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBox, faTags, faListAlt, faBars } from '@fortawesome/free-solid-svg-icons'; // Import faBars

const SideBar = () => {
  return (
    <div className="sidebar">
      <h2>PHARMACITY</h2>
      <ul>
        <li>
          <NavLink to="/product" activeClassName="active">
            <FontAwesomeIcon icon={faHouse} />
           SẢN PHẨM
          </NavLink>
        </li>

        <li>
          <NavLink to="/categories" activeClassName="active">
            <FontAwesomeIcon icon={faHouse} />
           DANH MỤC
          </NavLink>
        </li>

      </ul>
    </div>
  );
};

export default SideBar;
