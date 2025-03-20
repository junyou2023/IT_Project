// Base.js
document.addEventListener('DOMContentLoaded', function() {
  console.log('Base JS loaded');

  function onScrollChangeNavbar() {
    // console.log("scrollY = ", window.scrollY); // for debugging
    if (window.scrollY > 50) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScrollChangeNavbar);
});
