// Mobile Navigation Menu
function toggleMenu() {
    const nav = document.getElementById("navLinks");
    if (nav) {
        nav.classList.toggle("show");
    }
}

// Close menu after clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        const nav = document.getElementById("navLinks");
        if (nav) {
            nav.classList.remove("show");
        }
    });
});

// ==========================================================
// NAVBAR SCROLL EFFECT (TURNS WHITE ON SCROLL DOWN)
// ==========================================================
const headerEl = document.querySelector("header");

function handleNavbarScroll() {
    if (!headerEl) return;
    if (window.scrollY > 40) {
        headerEl.classList.add("scrolled");
    } else {
        headerEl.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleNavbarScroll, { passive: true });
// Run once on load in case the page is reloaded halfway down
handleNavbarScroll();

// ==========================================================
// APPLE-STYLE SMOOTH SCROLL (MOMENTUM & INERTIAL GLIDE)
// ==========================================================
let lenis = null;

if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
        duration: 1.25, // Apple-style gentle momentum glide duration
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple exponential glide curve
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1.0,
        smoothTouch: false, // Preserves native Apple iOS touch momentum on mobile
        touchMultiplier: 2.0,
        infinite: false,
    });

    // RequestAnimationFrame update loop
    function raf(time) {
        if (lenis) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
    }
    requestAnimationFrame(raf);

    // Sync navbar scroll state on each smooth frame
    lenis.on("scroll", () => {
        handleNavbarScroll();
    });
}

// Smooth scroll for internal anchor links (with capsule navbar offset)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (targetId && targetId !== "#") {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                if (lenis) {
                    lenis.scrollTo(targetEl, {
                        offset: -80,
                        duration: 1.4,
                        easing: (t) => 1 - Math.pow(1 - t, 4),
                    });
                } else {
                    const y = targetEl.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: "smooth" });
                }
            }
        }
    });
});

// ==========================================================
// HERO BACKGROUND IMAGE SLIDESHOW ANIMATION
// ==========================================================
const heroSlides = document.querySelectorAll(".hero-slide");
const heroDots = document.querySelectorAll(".slider-dots .dot");
const prevBtn = document.getElementById("heroPrev");
const nextBtn = document.getElementById("heroNext");

let currentSlideIndex = 0;
let slideInterval = null;
const SLIDE_DURATION = 3000; // 5 seconds per slide

function showSlide(index) {
    if (!heroSlides.length) return;

    if (index >= heroSlides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = heroSlides.length - 1;
    } else {
        currentSlideIndex = index;
    }

    heroSlides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentSlideIndex);
    });

    heroDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlideIndex);
    });
}

function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

function prevSlide() {
    showSlide(currentSlideIndex - 1);
}

function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(nextSlide, SLIDE_DURATION);
}

function stopSlideTimer() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

if (heroSlides.length > 0) {
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            startSlideTimer();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            startSlideTimer();
        });
    }

    heroDots.forEach(dot => {
        dot.addEventListener("click", (e) => {
            const targetIndex = parseInt(e.target.getAttribute("data-index"), 10);
            if (!isNaN(targetIndex)) {
                showSlide(targetIndex);
                startSlideTimer();
            }
        });
    });

    // Pause slideshow on hover over hero section for pleasant UX
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
        heroSection.addEventListener("mouseenter", stopSlideTimer);
        heroSection.addEventListener("mouseleave", startSlideTimer);
    }

    startSlideTimer();
}

// ==========================================================
// Mehndi Gallery Filter
// ==========================================================
const filterButtons = document.querySelectorAll(".filter");
const designCards = document.querySelectorAll(".design-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.getAttribute("data-category");

        designCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");
            if (category === "all" || cardCategory === category) {
                card.style.display = "block";
                card.style.animation = "fadeInUp 0.5s ease forwards";
            } else {
                card.style.display = "none";
            }
        });
    });
});

// ==========================================================
// Booking Form
// ==========================================================
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const service = document.getElementById("service").value;
        const date = document.getElementById("date").value;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDate = new Date(date + "T00:00:00");

        if (!name || !email || !phone || !service || !date) {
            alert("Please fill in all required fields!");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            alert("Please enter a valid 10-digit phone number!");
            return;
        }

        if (selectedDate < today) {
            alert("Please select a future date!");
            return;
        }

        const successMsg = document.getElementById("successMessage");
        if (successMsg) {
            successMsg.innerText =
                "Thank you, " + name + "! Your booking request for " + service + " has been received. We will contact you shortly.";
            successMsg.style.color = "#7a4628";
        }

        bookingForm.reset();
    });
}
