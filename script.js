/* =========================================
   1. BIRTHDAY ELEMENTS
========================================= */

const birthdayMusic = document.getElementById("birthdayMusic");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");
const openGift = document.getElementById("openGift");
const closeGift = document.getElementById("closeGift");
const replayGift = document.getElementById("replayGift");
const birthdayModal = document.getElementById("birthdayModal");
const giftBox = document.getElementById("giftBox");
const birthdayMessage = document.getElementById("birthdayMessage");
const sparkles = document.getElementById("sparkles");

const entryScreen = document.getElementById("entryScreen");
const enterButton = document.getElementById("enterButton");
const entryContent = document.getElementById("entryContent");
const entryGiftOverlay = document.getElementById("entryGiftOverlay");
const entryGiftBox = document.getElementById("entryGiftBox");
const entrySparkles = document.getElementById("entrySparkles");
const entryBirthdayMessage = document.getElementById("entryBirthdayMessage");
const floatingMusic = document.getElementById("floatingMusic");

// Features Section Gift Elements
const interactiveGiftBox = document.getElementById("interactiveGiftBox");
const clickMeText = document.getElementById("clickMeText");
const interactiveMessage = document.getElementById("interactiveMessage");

let giftTimers = [];
let confettiElements = [];
let revealInitialized = false;
let isInteractiveGiftOpened = false;


/* =========================================
   2. ENTRY SCREEN + GIFT ANIMATION
========================================= */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);
document.body.style.overflow = "hidden";

enterButton.addEventListener("click", async () => {
    try {
        await birthdayMusic.play();
    } catch (error) {
        console.log("Musik belum dapat diputar:", error);
    }

    entryContent.style.opacity = "0";
    entryContent.style.transform = "translateY(-30px)";

    setTimeout(() => {
        entryContent.hidden = true;
        entryGiftOverlay.hidden = false;
    }, 500);

    setTimeout(() => {
        entryGiftBox.classList.add("open");
        createSparkles(entrySparkles);
    }, 1000);

    setTimeout(() => {
        createConfetti();
        createFireworks();
    }, 1500);

    setTimeout(() => {
        entryBirthdayMessage.classList.add("show");
    }, 2000);

    setTimeout(() => {
        clearConfetti();
        document.querySelectorAll(".firework-particle").forEach(el => el.remove());
        entrySparkles.innerHTML = "";

        entryScreen.classList.add("hide");
        document.body.style.overflow = "";

        setTimeout(() => {
            floatingMusic.classList.add("show");
            updateFloatingMusic();
            initScrollReveal();
        }, 700);
    }, 4500);
});


/* =========================================
   3. INTERACTIVE GIFT (Features Section)
========================================= */

interactiveGiftBox.addEventListener("click", () => {
    if (isInteractiveGiftOpened) return; // Cegah klik berulang
    isInteractiveGiftOpened = true;

    // Sembunyikan teks "Klik Aku"
    clickMeText.style.opacity = "0";

    // Buka kado
    interactiveGiftBox.classList.add("open");

    // Tembak kembang api & confetti
    createFireworks();
    createConfetti();

    // Tampilkan pesan setelah tutup kado terbuka
    setTimeout(() => {
        interactiveMessage.classList.add("show");
    }, 800);
});


/* =========================================
   4. FLOATING MUSIC BUTTON
========================================= */

function updateFloatingMusic() {
    if (birthdayMusic.paused) {
        floatingMusic.textContent = "🔇";
        floatingMusic.classList.add("paused");
    } else {
        floatingMusic.textContent = "🎵";
        floatingMusic.classList.remove("paused");
    }
}

floatingMusic.addEventListener("click", async () => {
    if (birthdayMusic.paused) {
        try {
            await birthdayMusic.play();
        } catch (error) {
            console.log(error);
        }
    } else {
        birthdayMusic.pause();
    }
});

birthdayMusic.addEventListener("play", updateFloatingMusic);
birthdayMusic.addEventListener("pause", updateFloatingMusic);


/* =========================================
   5. SCROLL REVEAL (Dua Arah)
========================================= */

function initScrollReveal() {
    if (revealInitialized) return;
    revealInitialized = true;

    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                } else {
                    entry.target.classList.remove("active");
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    reveals.forEach((element, index) => {
        element.style.transitionDelay = `${(index % 4) * 100}ms`;
        observer.observe(element);
    });
}


/* =========================================
   6. UTILITIES (Timers, Sparkles, Confetti, Fireworks)
========================================= */

function clearGiftTimers() {
    giftTimers.forEach((timer) => clearTimeout(timer));
    giftTimers = [];
}

function createSparkles(targetElement) {
    const container = targetElement || sparkles;
    container.innerHTML = "";
    const symbols = ["✨", "⭐", "💜", "🌟", "💖"];

    for (let i = 0; i < 28; i++) {
        const sparkle = document.createElement("span");
        sparkle.className = "spark";
        sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = 70 + Math.random() * 160;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        sparkle.style.setProperty("--x", `${x}px`);
        sparkle.style.setProperty("--y", `${y}px`);
        sparkle.style.animationDelay = `${Math.random() * 0.3}s`;

        container.appendChild(sparkle);
    }
}

function createConfetti() {
    const colors = ["#a855f7", "#ec4899", "#facc15", "#22d3ee", "#ffffff", "#c084fc"];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
        confetti.style.setProperty("--duration", `${2 + Math.random() * 2}s`);
        confetti.style.animationDelay = `${Math.random() * 0.8}s`;

        document.body.appendChild(confetti);
        confettiElements.push(confetti);

        const removeTimer = setTimeout(() => {
            confetti.remove();
            confettiElements = confettiElements.filter(item => item !== confetti);
        }, 5500);

        giftTimers.push(removeTimer);
    }
}

function createFireworks() {
    const colors = ["#a855f7", "#ec4899", "#facc15", "#22d3ee", "#f9a8d4", "#c084fc", "#ffffff"];
    const bursts = 5;

    for (let b = 0; b < bursts; b++) {
        const delay = b * 380;

        giftTimers.push(setTimeout(() => {
            const startX = 15 + Math.random() * 70;
            const startY = 15 + Math.random() * 45;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const particleCount = 24;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement("div");
                particle.className = "firework-particle";

                const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.2;
                const distance = 100 + Math.random() * 150;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                particle.style.left = startX + "%";
                particle.style.top = startY + "%";
                particle.style.backgroundColor = color;
                particle.style.setProperty("--color", color);
                particle.style.setProperty("--x", x + "px");
                particle.style.setProperty("--y", y + "px");
                particle.style.setProperty("--duration", (1 + Math.random() * 0.6) + "s");

                document.body.appendChild(particle);

                const removeTimer = setTimeout(() => particle.remove(), 2000);
                giftTimers.push(removeTimer);
            }
        }, delay));
    }
}

function clearConfetti() {
    confettiElements.forEach((item) => item.remove());
    confettiElements = [];
}


/* =========================================
   7. MUSIC SYSTEM (Modal)
========================================= */

function updateMusicButton() {
    if (!birthdayMusic.paused) {
        musicToggle.textContent = "❚❚ Jeda Musik";
        musicToggle.classList.add("playing");
        musicStatus.textContent = "🎵 Musik sedang diputar";
    } else {
        musicToggle.textContent = "▶ Putar Musik";
        musicToggle.classList.remove("playing");
        musicStatus.textContent = "🎵 Musik dijeda";
    }
}

async function playBirthdayMusic() {
    try {
        await birthdayMusic.play();
        updateMusicButton();
    } catch (error) {
        console.log("Musik belum dapat diputar:", error);
        musicStatus.textContent = "Klik tombol untuk memulai musik 🎵";
        updateMusicButton();
    }
}

function pauseBirthdayMusic() {
    birthdayMusic.pause();
    updateMusicButton();
}

musicToggle.addEventListener("click", async () => {
    if (birthdayMusic.paused) {
        await playBirthdayMusic();
    } else {
        pauseBirthdayMusic();
    }
});

birthdayMusic.addEventListener("play", updateMusicButton);
birthdayMusic.addEventListener("pause", updateMusicButton);


/* =========================================
   8. MODAL BIRTHDAY ANIMATION
========================================= */

function startBirthdayAnimation() {
    clearGiftTimers();
    clearConfetti();

    giftBox.classList.remove("open");
    birthdayMessage.classList.remove("show");
    replayGift.hidden = true;
    sparkles.innerHTML = "";

    giftTimers.push(setTimeout(() => {
        giftBox.classList.add("open");
        createSparkles();
    }, 500));

    giftTimers.push(setTimeout(() => {
        createConfetti();
        createFireworks();
    }, 1000));

    giftTimers.push(setTimeout(() => {
        birthdayMessage.classList.add("show");
        replayGift.hidden = false;
    }, 1500));
}

openGift.addEventListener("click", async () => {
    birthdayModal.classList.add("show");
    birthdayModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    startBirthdayAnimation();

    if (birthdayMusic.paused) {
        await playBirthdayMusic();
    }
});

function closeBirthdayModal() {
    birthdayModal.classList.remove("show");
    birthdayModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    clearGiftTimers();

    giftBox.classList.remove("open");
    birthdayMessage.classList.remove("show");
    replayGift.hidden = true;
    sparkles.innerHTML = "";

    clearConfetti();
    document.querySelectorAll(".firework-particle").forEach(el => el.remove());
}

closeGift.addEventListener("click", closeBirthdayModal);
birthdayModal.addEventListener("click", (event) => {
    if (event.target === birthdayModal) closeBirthdayModal();
});
replayGift.addEventListener("click", () => startBirthdayAnimation());
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && birthdayModal.classList.contains("show")) {
        closeBirthdayModal();
    }
});


/* =========================================
   9. INITIAL STATE
========================================= */

updateMusicButton();
updateFloatingMusic();