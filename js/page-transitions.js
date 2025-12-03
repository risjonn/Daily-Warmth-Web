/* ============================================
   PAGE TRANSITIONS
   ============================================ */

document.addEventListener("DOMContentLoaded", function () {
  // Get all internal links
  const links = document.querySelectorAll(
    'a[href]:not([href^="#"]):not([href^="http"])'
  );

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetUrl = this.getAttribute("href");

      // Add exit animation
      document.body.classList.add("page-exit");

      // Navigate after animation completes
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 400); // Match the animation duration in CSS
    });
  });
});
