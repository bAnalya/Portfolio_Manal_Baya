// ===== RESET SCROLL TO TOP ON LOAD =====
window.addEventListener('load', () => {
  if (window.location.hash) {
    // Remove hash and scroll to top
    history.replaceState(null, null, ' ');
    window.scrollTo({ top: 0 });
  }
});


// ===== SMOOTH SCROLL (only for section links) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (target && ["#about", "#projects-section", "#contact"].includes(href)) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ===== FADE-IN ON SCROLL =====
const faders = document.querySelectorAll('section');
const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(section => {
  appearOnScroll.observe(section);
});


// ===== PROJECT MODALS =====
document.addEventListener("DOMContentLoaded", () => {

  // ---- OPEN MODAL ----
  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("mousedown", e => {
      // Stop default browser behavior immediately (before scroll animation)
      e.preventDefault();
    });

    card.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      // Instantly cancel any ongoing smooth scroll
      document.documentElement.style.scrollBehavior = 'auto';
      window.stop(); // stop any in-progress scroll animation

      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);

      if (modal) {
        const scrollY = window.scrollY;
        document.body.dataset.scrollY = scrollY;

        modal.style.display = "block";
        document.body.classList.add("modal-open");
        document.documentElement.classList.add("modal-open");

        // Lock scroll visually and functionally
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
      }
    });
  });

  // ---- CLOSE MODAL (×) ----
  document.querySelectorAll(".close").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const modal = btn.closest(".modal");
      if (modal) {
        modal.style.display = "none";

        // Restore scroll position
        const scrollY = parseInt(document.body.dataset.scrollY || "0");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.classList.remove("modal-open");
        document.documentElement.classList.remove("modal-open");

        // Restore scroll + smooth behavior
        window.scrollTo(0, scrollY);
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'smooth';
        }, 50);
      }
    });
  });

  // ---- CLOSE MODAL ON OUTSIDE CLICK ----
  window.addEventListener("click", e => {
    document.querySelectorAll(".modal").forEach(modal => {
      if (e.target === modal) {
        modal.style.display = "none";
        const scrollY = parseInt(document.body.dataset.scrollY || "0");
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        document.body.classList.remove("modal-open");
        document.documentElement.classList.remove("modal-open");
        window.scrollTo(0, scrollY);
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'smooth';
        }, 50);
      }
    });
  });
});

// === SCROLL NAVIGATION DOTS ===
const dots = document.querySelectorAll(".scroll-nav .dot");
const sections = document.querySelectorAll("section");

// Click to scroll to section
dots.forEach(dot => {
  dot.addEventListener("click", () => {
    const target = document.querySelector(dot.dataset.target);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Observe which section is visible
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      dots.forEach(dot => dot.classList.remove("active"));
      const activeDot = document.querySelector(`.dot[data-target="#${entry.target.id}"]`);
      if (activeDot) activeDot.classList.add("active");
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));
