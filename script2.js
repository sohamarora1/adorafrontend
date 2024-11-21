'use strict';

// Document ready event
document.addEventListener('DOMContentLoaded', () => {
  
  /** USER AUTHENTICATION (LOGIN/LOGOUT) **/
  const token = localStorage.getItem('token');
  const userBtn = document.getElementById('user-btn');
  const profileLink = document.getElementById('profile-link');
  
  if (token) {
    // If user is logged in
    userBtn.innerHTML = '<a href="logout.html"><ion-icon name="log-out-outline"></ion-icon> Logout</a>';
    profileLink.style.display = 'inline-block';
  } else {
    // If user is not logged in
    userBtn.innerHTML = '<a href="login.html"><ion-icon name="log-in-outline"></ion-icon> Login</a>';
    profileLink.style.display = 'none';
  }

  // Redirect to cart page
  document.getElementById('cart-btn').addEventListener('click', () => {
    window.location.href = 'cart.html';
  });

  /** NAVBAR TOGGLE **/
  const navTogglers = document.querySelectorAll("[data-nav-toggler]");
  const navbar = document.querySelector("[data-navbar]");
  const navbarLinks = document.querySelectorAll("[data-nav-link]");
  const overlay = document.querySelector("[data-overlay]");

  const toggleNavbar = function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  const closeNavbar = function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  };

  navTogglers.forEach(toggler => toggler.addEventListener("click", toggleNavbar));
  navbarLinks.forEach(link => link.addEventListener("click", closeNavbar));

  /** HEADER STICKY & BACK-TO-TOP BUTTON **/
  const header = document.querySelector("[data-header]");
  const backTopBtn = document.querySelector("[data-back-top-btn]");

  const headerActive = function () {
    if (window.scrollY > 150) {
      header.classList.add("active");
      backTopBtn.classList.add("active");
    } else {
      header.classList.remove("active");
      backTopBtn.classList.remove("active");
    }
  };

  let lastScrolledPos = 0;
  const headerSticky = function () {
    if (lastScrolledPos >= window.scrollY) {
      header.classList.remove("header-hide");
    } else {
      header.classList.add("header-hide");
    }
    lastScrolledPos = window.scrollY;
  };

  window.addEventListener("scroll", headerActive);
  window.addEventListener("scroll", headerSticky);

  /** SCROLL REVEAL EFFECT **/
  const sections = document.querySelectorAll("[data-section]");

  const scrollReveal = function () {
    sections.forEach(section => {
      if (section.getBoundingClientRect().top < window.innerHeight / 2) {
        section.classList.add("active");
      }
    });
  };

  scrollReveal(); // Initial call
  window.addEventListener("scroll", scrollReveal);
});
