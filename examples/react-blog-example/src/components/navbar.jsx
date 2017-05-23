import React from 'react';

const NavBar = () => {
  return (
	<nav className="nav">
	  <div className="nav-left">
	  </div>
	  <div className="nav-center">
	    <a className="nav-item" href="/">
	      <small>geekodour's blog</small>
	    </a>
	  </div>
	  <span id="nav-toggle" className="nav-toggle">
	    <span></span>
	    <span></span>
	    <span></span>
	  </span>
	  <div id="nav-menu" className="nav-right nav-menu">
	    <a className="nav-item" href="">projects</a>
	    <a className="nav-item" href="">favorites</a>
	    <a className="nav-item" href="">contact</a>
	  </div>
	</nav>
  );
}

export default NavBar;
