import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  IoHomeOutline,
  IoGridOutline,
  IoBagOutline,
  IoReceiptOutline,
  IoPersonOutline
} from 'react-icons/io5';

const MobileNavbar = () => {
  const cartItems = useSelector((state) => state.cart?.items || []);
  const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <nav className="jsr-mobile-bottom-bar" aria-label="Mobile Navigation">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `jsr-mob-nav-item ${isActive ? 'jsr-mob-nav-active' : ''}`
        }
      >
        <IoHomeOutline size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/products"
        className={({ isActive }) =>
          `jsr-mob-nav-item ${isActive ? 'jsr-mob-nav-active' : ''}`
        }
      >
        <IoGridOutline size={22} />
        <span>Categories</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) =>
          `jsr-mob-nav-item jsr-mob-cart ${isActive ? 'jsr-mob-nav-active' : ''}`
        }
      >
        <div className="jsr-mob-icon-wrap">
          <IoBagOutline size={22} />
          {totalCount > 0 && <span className="jsr-mob-badge">{totalCount}</span>}
        </div>
        <span>Cart</span>
      </NavLink>

      <NavLink
        to="/order-tracking"
        className={({ isActive }) =>
          `jsr-mob-nav-item ${isActive ? 'jsr-mob-nav-active' : ''}`
        }
      >
        <IoReceiptOutline size={22} />
        <span>Orders</span>
      </NavLink>

      <NavLink
        to="/account"
        className={({ isActive }) =>
          `jsr-mob-nav-item ${isActive ? 'jsr-mob-nav-active' : ''}`
        }
      >
        <IoPersonOutline size={22} />
        <span>Account</span>
      </NavLink>
    </nav>
  );
};

export default MobileNavbar;
