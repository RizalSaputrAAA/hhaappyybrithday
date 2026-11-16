/* =========================================
   1. BIRTHDAY ELEMENTS
========================================= */

const birthdayMusic =
    document.getElementById("birthdayMusic");

const musicToggle =
    document.getElementById("musicToggle");

const musicStatus =
    document.getElementById("musicStatus");

const openGift =
    document.getElementById("openGift");

const closeGift =
    document.getElementById("closeGift");

const replayGift =
    document.getElementById("replayGift");

const birthdayModal =
    document.getElementById("birthdayModal");

const giftBox =
    document.getElementById("giftBox");

const birthdayMessage =
    document.getElementById("birthdayMessage");

const sparkles =
    document.getElementById("sparkles");

const entryScreen =
    document.getElementById("entryScreen");

const enterButton =
    document.getElementById("enterButton");

const entryContent =
    document.getElementById("entryContent");

const entryGiftOverlay =
    document.getElementById("entryGiftOverlay");

const entryGiftBox =
    document.getElementById("entryGiftBox");

const entrySparkles =
    document.getElementById("entrySparkles");

const entryBirthdayMessage =
    document.getElementById("entryBirthdayMessage");

const floatingMusic =
    document.getElementById("floatingMusic");


let giftTimers = [];

let confettiElements = [];

let revealInitialized = false;


/* =========================================
   2. ENTRY SCREEN + GIFT ANIMATION
========================================= */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);

document.body.style.overflow = "hidden";


enterButton.addEventListener("click", async () => {

    // 1. Putar musik
    try {

        await birthdayMusic.play();

    } catch (error) {

        console.log(
            "Musik belum dapat diputar:",
            error
        );

    }


    // 2. Fade out entry content
    entryContent.style.opacity = "0";
    entryContent.style.transform = "translateY(-30px)";


    // 3. Setelah content hilang, tampilkan gift scene
    setTimeout(() => {

        entryContent.hidden = true;
        entryGiftOverlay.hidden = false;

    }, 500);


    // 4. Kado terbuka + sparkles keluar
    setTimeout(() => {

        entryGiftBox.classList.add("open");

        createSparkles(entrySparkles);

    }, 1000);


    // 5. Confetti + kembang api (fireworks)
    setTimeout(() => {

        createConfetti();
        createFireworks();

    }, 1500);


    // 6. Ucapan muncul
    setTimeout(() => {

        entryBirthdayMessage.classList.add("show");

    }, 2000);


    // 7. Fade out seluruh entry screen
    setTimeout(() => {

        // Bersihkan sisa efek
        clearConfetti();

        document
            .querySelectorAll(".firework-particle")
            .forEach(el => el.remove());

        entrySparkles.innerHTML = "";

        // Sembunyikan entry screen
        entryScreen.classList.add("hide");

        document.body.style.overflow = "";


        // Tampilkan floating music + aktifkan scroll reveal
        setTimeout(() => {

            floatingMusic.classList.add("show");

            updateFloatingMusic();

            initScrollReveal();

        }, 700);

    }, 4500);

});


/* =========================================
   3. FLOATING MUSIC BUTTON
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


birthdayMusic.addEventListener(
    "play",
    updateFloatingMusic
);

birthdayMusic.addEventListener(
    "pause",
    updateFloatingMusic
);


/* =========================================
   4. SCROLL REVEAL (Dua Arah)
========================================= */

function initScrollReveal() {

    if (revealInitialized) return;

    revealInitialized = true;

    const reveals =
        document.querySelectorAll(".reveal");

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
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    reveals.forEach((element, index) => {

        element.style.transitionDelay =
            `${(index % 4) * 100}ms`;

        observer.observe(element);

    });

}


/* =========================================
   5. IMAGE UPLOAD SYSTEM
========================================= */

function setupImageUpload(config) {

    const uploadInput =
        document.getElementById(config.input);

    const imageElement =
        document.getElementById(config.image);

    const placeholder =
        document.getElementById(config.placeholder);

    const removeButton =
        document.getElementById(config.remove);

    const storageKey = config.storageKey;

    const MAX_SIZE = 1 * 1024 * 1024;


    function displayImage(imageData) {

        imageElement.src = imageData;

        imageElement.hidden = false;

        placeholder.hidden = true;

        removeButton.hidden = false;

    }


    function loadSavedImage() {

        try {

            const savedImage =
                localStorage.getItem(storageKey);

            if (savedImage) {

                displayImage(savedImage);

            }

        } catch (error) {

            console.error(
                "Gagal memuat gambar:",
                error
            );

        }

    }


    uploadInput.addEventListener("change", function(event) {

        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            alert("Silakan pilih file gambar!");

            uploadInput.value = "";

            return;

        }

        if (file.size > MAX_SIZE) {

            alert("Ukuran gambar maksimal 1 MB!");

            uploadInput.value = "";

            return;

        }

        const reader = new FileReader();

        reader.onload = function() {

            try {

                localStorage.setItem(
                    storageKey,
                    reader.result
                );

                displayImage(reader.result);

            } catch (error) {

                alert(
                    "Gambar gagal disimpan. " +
                    "Penyimpanan browser mungkin penuh."
                );

                console.error(error);

            }

        };

        reader.onerror = function() {

            alert("Gagal membaca gambar!");

        };

        reader.readAsDataURL(file);

    });


    removeButton.addEventListener("click", function() {

        const confirmation = confirm(
            "Apakah kamu yakin ingin menghapus gambar?"
        );

        if (!confirmation) return;

        try {

            localStorage.removeItem(storageKey);

            imageElement.removeAttribute("src");

            imageElement.hidden = true;

            placeholder.hidden = false;

            removeButton.hidden = true;

            uploadInput.value = "";

        } catch (error) {

            alert("Gagal menghapus gambar!");

            console.error(error);

        }

    });


    loadSavedImage();

}


/* =========================================
   6. CREATIVE DESIGN IMAGE
========================================= */

setupImageUpload({
    input: "creativeUpload",
    image: "creativeImage",
    placeholder: "creativePlaceholder",
    remove: "removeCreative",
    storageKey: "creativeDesignCardImage"
});


/* =========================================
   7. ABOUT IMAGE
========================================= */

setupImageUpload({
    input: "aboutUpload",
    image: "aboutImage",
    placeholder: "aboutPlaceholder",
    remove: "removeAbout",
    storageKey: "aboutSectionImage"
});


/* =========================================
   8. FEATURE CARDS IMAGES
========================================= */

setupImageUpload({
    input: "cardUpload1",
    image: "cardImage1",
    placeholder: "cardPlaceholder1",
    remove: "removeCard1",
    storageKey: "featureCard1Image"
});

setupImageUpload({
    input: "cardUpload2",
    image: "cardImage2",
    placeholder: "cardPlaceholder2",
    remove: "removeCard2",
    storageKey: "featureCard2Image"
});

setupImageUpload({
    input: "cardUpload3",
    image: "cardImage3",
    placeholder: "cardPlaceholder3",
    remove: "removeCard3",
    storageKey: "featureCard3Image"
});


/* =========================================
   9. CLEAR ANIMATION TIMERS
========================================= */

function clearGiftTimers() {

    giftTimers.forEach((timer) => {

        clearTimeout(timer);

    });

    giftTimers = [];

}


/* =========================================
   10. CREATE SPARKLES
========================================= */

function createSparkles(targetElement) {

    const container =
        targetElement || sparkles;

    container.innerHTML = "";

    const symbols = [
        "✨",
        "⭐",
        "💜",
        "🌟",
        "💖"
    ];


    for (let i = 0; i < 28; i++) {

        const sparkle =
            document.createElement("span");

        sparkle.className = "spark";

        sparkle.textContent =
            symbols[
                Math.floor(
                    Math.random() * symbols.length
                )
            ];


        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            70 + Math.random() * 160;

        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;


        sparkle.style.setProperty(
            "--x",
            `${x}px`
        );

        sparkle.style.setProperty(
            "--y",
            `${y}px`
        );

        sparkle.style.animationDelay =
            `${Math.random() * 0.3}s`;


        container.appendChild(sparkle);

    }

}


/* =========================================
   11. CREATE CONFETTI
========================================= */

function createConfetti() {

    const colors = [
        "#a855f7",
        "#ec4899",
        "#facc15",
        "#22d3ee",
        "#ffffff",
        "#c084fc"
    ];


    for (let i = 0; i < 100; i++) {

        const confetti =
            document.createElement("div");

        confetti.className = "confetti";

        confetti.style.left =
            Math.random() * 100 + "vw";

        confetti.style.backgroundColor =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        confetti.style.borderRadius =
            Math.random() > 0.5
                ? "50%"
                : "2px";

        confetti.style.setProperty(
            "--duration",
            `${2 + Math.random() * 2}s`
        );

        confetti.style.animationDelay =
            `${Math.random() * 0.8}s`;


        document.body.appendChild(confetti);

        confettiElements.push(confetti);


        const removeTimer = setTimeout(() => {

            confetti.remove();

            confettiElements =
                confettiElements.filter(
                    item => item !== confetti
                );

        }, 5500);


        giftTimers.push(removeTimer);

    }

}


/* =========================================
   12. CREATE FIREWORKS (KEMBANG API)
========================================= */

function createFireworks() {

    const colors = [
        "#a855f7",
        "#ec4899",
        "#facc15",
        "#22d3ee",
        "#f9a8d4",
        "#c084fc",
        "#ffffff"
    ];

    const bursts = 5;


    for (let b = 0; b < bursts; b++) {

        const delay = b * 380;


        giftTimers.push(setTimeout(() => {

            const startX =
                15 + Math.random() * 70;

            const startY =
                15 + Math.random() * 45;

            const color =
                colors[
                    Math.floor(
                        Math.random() * colors.length
                    )
                ];

            const particleCount = 24;


            for (let i = 0; i < particleCount; i++) {

                const particle =
                    document.createElement("div");

                particle.className =
                    "firework-particle";


                const angle =
                    (Math.PI * 2 * i) / particleCount
                    + Math.random() * 0.2;

                const distance =
                    100 + Math.random() * 150;

                const x =
                    Math.cos(angle) * distance;

                const y =
                    Math.sin(angle) * distance;


                particle.style.left = startX + "%";

                particle.style.top = startY + "%";

                particle.style.backgroundColor = color;

                particle.style.setProperty(
                    "--color",
                    color
                );

                particle.style.setProperty(
                    "--x",
                    x + "px"
                );

                particle.style.setProperty(
                    "--y",
                    y + "px"
                );

                particle.style.setProperty(
                    "--duration",
                    (1 + Math.random() * 0.6) + "s"
                );


                document.body.appendChild(particle);


                const removeTimer = setTimeout(() => {

                    particle.remove();

                }, 2000);


                giftTimers.push(removeTimer);

            }

        }, delay));

    }

}


/* =========================================
   13. CLEAR CONFETTI
========================================= */

function clearConfetti() {

    confettiElements.forEach((item) => {

        item.remove();

    });

    confettiElements = [];

}


/* =========================================
   14. MUSIC SYSTEM (Modal)
========================================= */

function updateMusicButton() {

    if (!birthdayMusic.paused) {

        musicToggle.textContent =
            "❚❚ Jeda Musik";

        musicToggle.classList.add("playing");

        musicStatus.textContent =
            "🎵 Musik sedang diputar";

    } else {

        musicToggle.textContent =
            "▶ Putar Musik";

        musicToggle.classList.remove("playing");

        musicStatus.textContent =
            "🎵 Musik dijeda";

    }

}


async function playBirthdayMusic() {

    try {

        await birthdayMusic.play();

        updateMusicButton();

    } catch (error) {

        console.log(
            "Musik belum dapat diputar:",
            error
        );

        musicStatus.textContent =
            "Klik tombol untuk memulai musik 🎵";

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


birthdayMusic.addEventListener(
    "play",
    updateMusicButton
);

birthdayMusic.addEventListener(
    "pause",
    updateMusicButton
);


/* =========================================
   15. START BIRTHDAY ANIMATION (Modal)
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


/* =========================================
   16. OPEN GIFT
========================================= */

openGift.addEventListener("click", async () => {

    birthdayModal.classList.add("show");

    birthdayModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";


    startBirthdayAnimation();


    if (birthdayMusic.paused) {

        await playBirthdayMusic();

    }

});


/* =========================================
   17. CLOSE BIRTHDAY MODAL
========================================= */

function closeBirthdayModal() {

    birthdayModal.classList.remove("show");

    birthdayModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";


    clearGiftTimers();


    giftBox.classList.remove("open");

    birthdayMessage.classList.remove("show");

    replayGift.hidden = true;

    sparkles.innerHTML = "";


    clearConfetti();

    document
        .querySelectorAll(".firework-particle")
        .forEach(el => el.remove());

}


/* =========================================
   18. CLOSE BUTTON
========================================= */

closeGift.addEventListener(
    "click",
    closeBirthdayModal
);


/* =========================================
   19. CLICK OUTSIDE MODAL
========================================= */

birthdayModal.addEventListener("click", (event) => {

    if (event.target === birthdayModal) {

        closeBirthdayModal();

    }

});


/* =========================================
   20. REPLAY ANIMATION
========================================= */

replayGift.addEventListener("click", () => {

    startBirthdayAnimation();

});


/* =========================================
   21. ESCAPE KEY
========================================= */

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        birthdayModal.classList.contains("show")
    ) {

        closeBirthdayModal();

    }

});


/* =========================================
   22. INITIAL STATE
========================================= */

updateMusicButton();

updateFloatingMusic();