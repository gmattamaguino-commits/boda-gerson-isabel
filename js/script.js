"use strict";

/* =====================================================
   DATOS PERSONALIZADOS DEL INVITADO
   Ejemplo de URL:
   ?n=Familia%20Pérez&p=4
===================================================== */

function getGuestData() {
    const params = new URLSearchParams(
        window.location.search
    );

    return {
        nombre: params.get("n"),
        pases: params.get("p"),
        codigo: params.get("codigo")
    };
}

const guestData = getGuestData();

function showGuestGreeting() {
    const greetingElement = document.getElementById("guest-greeting");

    if (guestData.nombre && greetingElement) {
        greetingElement.textContent = `Querid@s ${guestData.nombre}`;
    }
}

/* =====================================================
   CUENTA REGRESIVA
===================================================== */

function startCountdown() {
    const countdownElement = document.querySelector(".countdown");

    if (!countdownElement) {
        return;
    }

    /*
     * Fecha de la boda:
     * 24 de octubre de 2026
     * 12:00 p. m.
     * Zona horaria de Perú: UTC-5
     */
    const weddingDate = new Date(
        "2026-10-24T12:00:00-05:00"
    ).getTime();

    function updateCountdown() {
        const currentDate = Date.now();
        const distance = weddingDate - currentDate;

        if (distance <= 0) {
            countdownElement.innerHTML = `
                <h3 class="countdown-finished">
                    💍 ¡Hoy es nuestro gran día!
                </h3>
            `;

            return false;
        }

        const days = Math.floor(
            distance / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (distance % (1000 * 60)) / 1000
        );

        const values = {
            days,
            hours,
            minutes,
            seconds
        };

        Object.entries(values).forEach(([id, value]) => {
            const element = document.getElementById(id);

            if (!element) {
                return;
            }

            const minimumDigits = id === "days" ? 3 : 2;

            element.textContent = String(value).padStart(
                minimumDigits,
                "0"
            );
        });

        return true;
    }

    updateCountdown();

    const timer = setInterval(() => {
        const countdownIsActive = updateCountdown();

        if (!countdownIsActive) {
            clearInterval(timer);
        }
    }, 1000);
}

/* =====================================================
   CANTIDAD DE PASES
===================================================== */

function showPassesMessage() {
    const passesElement = document.getElementById(
        "rsvp-passes"
    );

    if (!passesElement || !guestData.pases) {
        return;
    }

    const totalPasses = Number.parseInt(
        guestData.pases,
        10
    );

    /*
     * Evita valores inválidos o cantidades
     * exageradamente grandes desde la URL.
     */
    if (
        !Number.isInteger(totalPasses) ||
        totalPasses < 1 ||
        totalPasses > 20
    ) {
        return;
    }

    const passesHTML = Array.from(
        { length: totalPasses },
        (_, index) => `
            <div class="pass-dot-wrap">
                <div class="pass-dot filled"></div>
                <span class="pass-number">
                    ${index + 1}
                </span>
            </div>
        `
    ).join("");

    passesElement.innerHTML = `
        <p class="passes-label">
            Hemos reservado
        </p>

        <div class="passes-dots">
            ${passesHTML}
        </div>

        <p
            class="passes-label"
            style="margin-top:14px;"
        >
            Lugares en su honor
        </p>
    `;
}

/* =====================================================
   ANIMACIONES AL HACER SCROLL
===================================================== */

function initRevealAnimations() {
    const elements = document.querySelectorAll(
        `
        .subtitle-section,
        .title-section,
        .divider-center,
        .story-card,
        .schedule-card,
        .place-card,
        .dresscode-card,
        .form-cta,
        .regalo-card,
        .info-ninos-card,
        .gallery-item,
        .song-player,
        .gracias-content
        `
    );

    elements.forEach((element, index) => {
        element.classList.add("reveal");

        /*
         * Retraso escalonado para que los elementos
         * no aparezcan todos al mismo tiempo.
         */
        const delay = (index % 4) * 90;

        element.style.setProperty(
            "--reveal-delay",
            `${delay}ms`
        );
    });

    /*
     * Compatibilidad con navegadores antiguos.
     */
    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add(
                    "is-visible"
                );

                /*
                 * Dejamos de observar el elemento una vez
                 * que apareció para mejorar el rendimiento.
                 */
                currentObserver.unobserve(
                    entry.target
                );
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    elements.forEach((element) => {
        observer.observe(element);
    });
}

/* =====================================================
   GALERÍA Y LIGHTBOX
===================================================== */

window.openLightbox = function (galleryItem) {
    const image = galleryItem.querySelector("img");

    const lightbox = document.getElementById(
        "lightbox"
    );

    const lightboxImage = document.getElementById(
        "lightbox-img"
    );

    if (!image || !lightbox || !lightboxImage) {
        return;
    }

    lightboxImage.src =
        image.currentSrc || image.src;

    lightboxImage.alt =
        image.alt || "Fotografía ampliada";

    lightbox.classList.add("active");

    /*
     * Evita que la página siga desplazándose
     * mientras la fotografía está abierta.
     */
    document.body.style.overflow = "hidden";
};

window.closeLightbox = function () {
    const lightbox = document.getElementById(
        "lightbox"
    );

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove("active");

    document.body.style.overflow = "";
};

/* =====================================================
   REPRODUCTOR DE MÚSICA
===================================================== */

function initAudioPlayer() {
    const audio = document.getElementById(
        "wedding-audio"
    );

    const player = document.getElementById(
        "audio-player"
    );

    const playButton = document.getElementById(
        "audio-play-button"
    );

    const volumeButton = document.getElementById(
        "audio-volume-button"
    );

    const progress = document.getElementById(
        "audio-progress"
    );

    const currentTimeElement = document.getElementById(
        "audio-current-time"
    );

    const durationElement = document.getElementById(
        "audio-duration"
    );

    if (
        !audio ||
        !player ||
        !playButton ||
        !volumeButton ||
        !progress
    ) {
        return;
    }

    function formatAudioTime(seconds) {
        if (!Number.isFinite(seconds)) {
            return "00:00";
        }

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds = Math.floor(
            seconds % 60
        );

        return `${String(minutes).padStart(2, "0")}:${
            String(remainingSeconds).padStart(2, "0")
        }`;
    }

    function updateDuration() {
        durationElement.textContent =
            formatAudioTime(audio.duration);
    }

    function updateProgress() {
        if (!Number.isFinite(audio.duration)) {
            return;
        }

        const percentage =
            (audio.currentTime / audio.duration) * 100;

        progress.value = percentage;

        progress.style.setProperty(
            "--audio-progress",
            `${percentage}%`
        );

        currentTimeElement.textContent =
            formatAudioTime(audio.currentTime);
    }

    playButton.addEventListener(
        "click",
        async () => {
            try {
                if (audio.paused) {
                    await audio.play();
                } else {
                    audio.pause();
                }
            } catch (error) {
                console.error(
                    "No se pudo reproducir el audio:",
                    error
                );
            }
        }
    );

    audio.addEventListener("play", () => {
        player.classList.add("is-playing");

        playButton.setAttribute(
            "aria-label",
            "Pausar canción"
        );
    });

    audio.addEventListener("pause", () => {
        player.classList.remove("is-playing");

        playButton.setAttribute(
            "aria-label",
            "Reproducir canción"
        );
    });

    audio.addEventListener(
        "loadedmetadata",
        updateDuration
    );

    audio.addEventListener(
        "durationchange",
        updateDuration
    );

    audio.addEventListener(
        "timeupdate",
        updateProgress
    );

    progress.addEventListener("input", () => {
        if (!Number.isFinite(audio.duration)) {
            return;
        }

        const percentage = Number(progress.value);

        audio.currentTime =
            (percentage / 100) * audio.duration;

        progress.style.setProperty(
            "--audio-progress",
            `${percentage}%`
        );
    });

    volumeButton.addEventListener("click", () => {
        audio.muted = !audio.muted;

        player.classList.toggle(
            "is-muted",
            audio.muted
        );

        volumeButton.textContent =
            audio.muted ? "×" : "♫";

        volumeButton.setAttribute(
            "aria-label",
            audio.muted
                ? "Activar sonido"
                : "Silenciar canción"
        );
    });

    audio.addEventListener("ended", () => {
        player.classList.remove("is-playing");

        progress.value = 0;

        progress.style.setProperty(
            "--audio-progress",
            "0%"
        );

        currentTimeElement.textContent = "00:00";
    });
}


/* =====================================================
   MAPAS
===================================================== */

window.showMap = function (containerId, coordinates) {
    const mapContainer = document.getElementById(
        containerId
    );

    if (!mapContainer) {
        return;
    }

    mapContainer.innerHTML = `
        <iframe
            src="https://www.google.com/maps?q=${encodeURIComponent(
                coordinates
            )}&z=16&output=embed"
            title="Mapa de ubicación"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
    `;
};
/* =====================================================
   APERTURA DE LA INVITACIÓN
===================================================== */

function initInvitationOpening() {
    const cover = document.getElementById(
        "invitation-cover"
    );

    const openButton = document.getElementById(
        "open-invitation"
    );

    if (!cover || !openButton) {
        return;
    }

    document.body.classList.add(
        "invitation-closed"
    );

    openButton.addEventListener(
        "click",
        () => {
            cover.classList.add("is-opening");

            document.body.classList.remove(
                "invitation-closed"
            );

            document.body.classList.add(
                "invitation-open"
            );

            /*
             * Primero se abre el sobre y sale la carta.
             * Después desaparece la pantalla de apertura.
             */
            window.setTimeout(() => {
                cover.classList.add("is-hidden");
            }, 1350);

            window.setTimeout(() => {
                cover.remove();
                document.body.style.overflow = "";
            }, 2300);
        },
        { once: true }
    );
}
/* =====================================================
   FORMULARIO PRIVADO PARA REGALOS
===================================================== */

function configureGiftForm() {
    const giftButton = document.getElementById(
        "gift-form-button"
    );

    if (!giftButton) {
        return;
    }

    const formBaseURL =
        "https://docs.google.com/forms/d/e/1FAIpQLSfcSfTX_YKVaqRev6ps2Wc9wEB-q-EAMc1zO4zfWc1In1Agxw/viewform";

    const formParams = new URLSearchParams({
        usp: "pp_url",
        "entry.988199634":
            guestData.nombre || "",
        "entry.1231225220":
            guestData.codigo || "",
        "entry.995696210":
            "Ambas opciones"
    });

    giftButton.href =
        `${formBaseURL}?${formParams.toString()}`;

    /*
     * Si el enlace no tiene código, bloqueamos
     * el acceso automático para evitar solicitudes
     * sin invitación personalizada.
     */
    if (!guestData.codigo) {
        giftButton.removeAttribute("target");

        giftButton.addEventListener(
            "click",
            event => {
                event.preventDefault();

                alert(
                    "Para solicitar los datos de regalo, abre el enlace personalizado que recibiste con tu invitación."
                );
            }
        );
    }
}
/* =====================================================
   INICIALIZACIÓN
===================================================== */
/* =====================================================
   PERSONALIZACIÓN DEL INVITADO
===================================================== */

function initGuestPersonalization() {
    const params = new URLSearchParams(
        window.location.search
    );

    const guestName = (
        params.get("n") || ""
    ).trim();

    const passesValue = Number.parseInt(
        params.get("p"),
        10
    );

    const passes = Number.isFinite(passesValue)
        && passesValue > 0
        ? passesValue
        : 0;

    const letterGuest = document.getElementById(
        "invitation-guest-name"
    );

    const heroGreeting = document.getElementById(
        "guest-greeting"
    );

    const guestCard = document.getElementById(
        "guest-invitation-card"
    );

    const guestCardName = document.getElementById(
        "guest-card-name"
    );

    const guestCardPasses = document.getElementById(
        "guest-card-passes"
    );

    const passIcons = document.getElementById(
        "guest-pass-icons"
    );

    /*
     * Sin nombre personalizado:
     * mantenemos una invitación general.
     */
    if (!guestName) {
        if (letterGuest) {
            letterGuest.textContent =
                "Nuestros familiares y amigos";
        }

        if (heroGreeting) {
            heroGreeting.textContent = "";
        }

        return;
    }

    if (letterGuest) {
        letterGuest.textContent = guestName;
    }

    if (heroGreeting) {
        heroGreeting.textContent =
            `Bienvenidos, ${guestName}`;
    }

    if (!guestCard) {
    console.error(
        "No se encontró #guest-invitation-card"
    );
    return;
}

if (!guestCardName) {
    console.error(
        "No se encontró #guest-card-name"
    );
    return;
}

if (!guestCardPasses) {
    console.error(
        "No se encontró #guest-card-passes"
    );
    return;
}

 guestCard.hidden = false;
guestCard.removeAttribute("hidden");
guestCard.style.display = "block";

guestCardName.textContent = guestName;

    if (passes === 1) {
        guestCardPasses.textContent =
            "Hemos reservado 1 lugar en tu honor.";
    } else if (passes > 1) {
        guestCardPasses.textContent =
            `Hemos reservado ${passes} lugares en su honor.`;
    } else {
        guestCardPasses.textContent =
            "Será un honor compartir este día contigo.";
    }

    if (passIcons && passes > 0) {
        passIcons.innerHTML = "";

        /*
         * Se limita visualmente a 10 íconos para evitar
         * que una URL incorrecta rompa el diseño.
         */
        const visiblePasses = Math.min(passes, 10);

        for (
            let index = 0;
            index < visiblePasses;
            index += 1
        ) {
            const icon = document.createElement("span");

            icon.className = "guest-pass-icon";
            icon.textContent = "♥";

            icon.style.animationDelay =
                `${index * 90}ms`;

            passIcons.appendChild(icon);
        }
    }
}
document.addEventListener(
    "DOMContentLoaded",
    () => {
        initGuestPersonalization();
        initAudioPlayer();
        initInvitationOpening();
        startCountdown();
        showPassesMessage();
        initRevealAnimations();
        configureGiftForm();

        /*
         * Permite cerrar una fotografía ampliada
         * presionando la tecla Escape.
         */
        document.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Escape") {
                    window.closeLightbox();
                }
            }
        );
    }
);