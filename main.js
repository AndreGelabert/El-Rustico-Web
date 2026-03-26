const heroBackgroundConfig = {
    selector: "#heroBackgroundImage",
    images: [
        "Resources/img/Fotodelpredio.jpg",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAzxdUGa4MjXsDrs6fX-wRSHjbX9BZRBn6cDrkhwkpbvG4_ZmomiBzY9OrQYmrbhn5aFFweJ7lP0EgCfuuIhizQTWin2meHQ7BXzxGeseTZziPykdS4j8k0fFX3nsRzIlMEcpz0t6zoaxi-QRW3aLxF7_BYimZDw_8TxRPOOdcX6uoJIZbOEmeRASYWx6drUI63q4-kv4vfj1IPmAt4nnlJfslDe-M76dT83PQafpF-flybtlzq-0gBd9PJNPKA72iVnqvefC8oYVE",
        "Resources/img/Fotodelpredio.jpg"
    ],
    intervalMs: 5000,
    transitionMs: 700,
    startIndex: 0,
    randomStart: false
};

function initHeroBackgroundSlider(config) {
    const target = document.querySelector(config.selector);
    if (!target) return;

    const images = (config.images || []).filter(Boolean);
    if (images.length === 0) return;

    const safeStartIndex = config.randomStart
        ? Math.floor(Math.random() * images.length)
        : Math.min(Math.max(config.startIndex || 0, 0), images.length - 1);

    let currentIndex = safeStartIndex;
    let isTransitioning = false;

    target.src = images[currentIndex];
    target.style.opacity = "1";
    target.style.transition = `opacity ${config.transitionMs}ms ease-in-out`;

    if (images.length === 1) return;

    const changeImage = () => {
        if (isTransitioning) return;
        isTransitioning = true;

        const nextIndex = (currentIndex + 1) % images.length;
        const nextSrc = images[nextIndex];
        const preload = new Image();

        const applyChange = () => {
            target.style.opacity = "0";

            window.setTimeout(() => {
                target.src = nextSrc;
                target.style.opacity = "1";
                currentIndex = nextIndex;
                window.setTimeout(() => {
                    isTransitioning = false;
                }, config.transitionMs);
            }, config.transitionMs);
        };

        preload.onload = applyChange;
        preload.onerror = applyChange;
        preload.src = nextSrc;
    };

    window.setInterval(changeImage, Math.max(config.intervalMs, config.transitionMs * 3));
}

const reviewsPool = [
    {
        text: "Muy buenas canchas, siempre en excelente estado. El lugar está cuidado y la atención para reservar por WhatsApp es rapidísima.",
        name: "Diego Rojas",
        rating: 5
    },
    {
        text: "Fuimos varias veces con amigos y nunca falla. Buen pasto, buena iluminación y muy buen ambiente para el tercer tiempo.",
        name: "Nicolás Benítez",
        rating: 5
    },
    {
        text: "La escuelita es excelente, los profes trabajan muy bien con los chicos. Predio limpio y seguro.",
        name: "Carolina Duarte",
        rating: 5
    },
    {
        text: "Excelente complejo para jugar fútbol 5. Después del partido nos quedamos en la cantina y la pasamos genial.",
        name: "Matías Ferreyra",
        rating: 5
    },
    {
        text: "Muy recomendable. Buenas canchas, estacionamiento cómodo y muy buena onda de todo el personal.",
        name: "Sofía Meza",
        rating: 4
    },
    {
        text: "De los mejores lugares para jugar en Montecarlo. Reservamos fácil y todo estaba listo cuando llegamos.",
        name: "Fernando Leiva",
        rating: 5
    },
    {
        text: "Ideal para ir con la familia. Mientras juegan, podés estar cómodo en el quincho y disfrutar del lugar.",
        name: "Paola Ramírez",
        rating: 5
    }
];

function getRandomReviews(pool, amount) {
    const copy = [...pool];
    const selected = [];

    while (selected.length < amount && copy.length > 0) {
        const idx = Math.floor(Math.random() * copy.length);
        selected.push(copy.splice(idx, 1)[0]);
    }

    return selected;
}

function buildStars(colorClass, rating = 5) {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

    return Array.from({ length: 5 }, (_, index) => {
        const isFilled = index < safeRating;
        return `<span class="material-symbols-outlined ${colorClass} text-sm" style="font-variation-settings: 'FILL' ${isFilled ? 1 : 0}; opacity: ${isFilled ? 1 : 0.5};">star</span>`;
    }).join("");
}

function renderRandomReviews() {
    const grid = document.getElementById("reviews-grid");
    if (!grid) return;

    const cardsToRender = Math.min(3, reviewsPool.length);
    const reviews = getRandomReviews(reviewsPool, cardsToRender);
    const borderColors = ["border-primary", "border-secondary", "border-primary"];
    const starColors = ["text-primary", "text-secondary", "text-primary"];

    grid.innerHTML = reviews.map((review, index) => `
        <div class="bg-surface-container p-8 rounded-xl text-left border-l-4 ${borderColors[index % borderColors.length]}">
            <div class="flex gap-1 mb-4">
                ${buildStars(starColors[index % starColors.length], review.rating ?? 5)}
            </div>
            <p class="italic text-on-surface-variant mb-6">"${review.text}"</p>
            <div class="font-bold text-sm tracking-widest font-label uppercase">— ${review.name}</div>
        </div>
    `).join("");
}

function applyTheme(theme) {
    const root = document.documentElement;
    const toggleIcon = document.getElementById("themeToggleIcon");
    const toggleButton = document.getElementById("themeToggle");
    const isDark = theme === "dark";

    root.classList.toggle("dark", isDark);

    if (toggleIcon) {
        toggleIcon.textContent = isDark ? "light_mode" : "dark_mode";
    }

    if (toggleButton) {
        toggleButton.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    }
}

function initThemeToggle() {
    const toggleButton = document.getElementById("themeToggle");
    if (!toggleButton) return;

    const storageKey = "elrustico-theme";
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const getSystemTheme = () => (mediaQuery.matches ? "dark" : "light");

    const savedTheme = localStorage.getItem(storageKey);
    const hasSavedTheme = savedTheme === "light" || savedTheme === "dark";
    const initialTheme = hasSavedTheme ? savedTheme : getSystemTheme();
    applyTheme(initialTheme);

    const onSystemThemeChange = (event) => {
        const currentSavedTheme = localStorage.getItem(storageKey);
        const stillAuto = currentSavedTheme !== "light" && currentSavedTheme !== "dark";
        if (stillAuto) {
            applyTheme(event.matches ? "dark" : "light");
        }
    };

    if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", onSystemThemeChange);
    } else if (typeof mediaQuery.addListener === "function") {
        mediaQuery.addListener(onSystemThemeChange);
    }

    toggleButton.addEventListener("click", () => {
        const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initHeroBackgroundSlider(heroBackgroundConfig);
    renderRandomReviews();
});
