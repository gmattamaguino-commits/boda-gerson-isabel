"use strict";

/* =====================================================
   DATOS PERSONALIZADOS DEL INVITADO

   Ejemplo:
   ?n=Familia%20Pérez&p=4&codigo=GI26-001
===================================================== */

function getGuestData() {
    const params = new URLSearchParams(
        window.location.search
    );

    return {
        nombre: (
            params.get("n") || ""
        ).trim(),

        pases: (
            params.get("p") || ""
        ).trim(),

        codigo: (
            params.get("codigo") || ""
        ).trim()
    };
}

const guestData = getGuestData();


/* =====================================================
   CUENTA REGRESIVA
===================================================== */

function startCountdown() {
    const countdownElement =
        document.querySelector(".countdown");

    if (!countdownElement) {
        return;
    }

    const weddingDate = new Date(
        "2026-10-24T12:00:00-05:00"
    ).getTime();

    function updateCountdown() {
        const distance =
            weddingDate - Date.now();

        if (distance <= 0) {
            countdownElement.innerHTML = `
                <h3 class="countdown-finished">
                    💍 ¡Hoy es nuestro gran día!
                </h3>
            `;

            return false;
        }

        const days = Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (
                distance %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );

        const minutes = Math.floor(
            (
                distance %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );

        const seconds = Math.floor(
            (
                distance %
                (1000 * 60)
            ) /
            1000
        );

        const values = {
            days,
            hours,
            minutes,
            seconds
        };

        Object.entries(values).forEach(
            ([id, value]) => {
                const element =
                    document.getElementById(id);

                if (!element) {
                    return;
                }

                const minimumDigits =
                    id === "days" ? 3 : 2;

                element.textContent =
                    String(value).padStart(
                        minimumDigits,
                        "0"
                    );
            }
        );

        return true;
    }

    const countdownIsActive =
        updateCountdown();

    if (!countdownIsActive) {
        return;
    }

    const timer = window.setInterval(
        () => {
            const stillActive =
                updateCountdown();

            if (!stillActive) {
                window.clearInterval(timer);
            }
        },
        1000
    );
}


/* =====================================================
   ANIMACIONES AL HACER SCROLL
===================================================== */

function initRevealAnimations() {
    const elements =
        document.querySelectorAll(`
            .subtitle-section,
            .title-section,
            .divider-center,
            .schedule-card,
            .place-card,
            .dresscode-card,
            .form-cta,
            .regalo-card,
            .info-ninos-card,
            .gallery-item,
            .gracias-content
        `);

    elements.forEach(
        (element, index) => {
            element.classList.add("reveal");

            const delay =
                (index % 4) * 90;

            element.style.setProperty(
                "--reveal-delay",
                `${delay}ms`
            );
        }
    );

    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {
        elements.forEach(element => {
            element.classList.add(
                "is-visible"
            );
        });

        return;
    }

    const observer =
        new IntersectionObserver(
            (
                entries,
                currentObserver
            ) => {
                entries.forEach(entry => {
                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }

                    entry.target.classList.add(
                        "is-visible"
                    );

                    currentObserver.unobserve(
                        entry.target
                    );
                });
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );

    elements.forEach(element => {
        observer.observe(element);
    });
}


/* =====================================================
   GALERÍA Y LIGHTBOX
===================================================== */

window.openLightbox = function (
    galleryItem
) {
    const image =
        galleryItem.querySelector("img");

    const lightbox =
        document.getElementById(
            "lightbox"
        );

    const lightboxImage =
        document.getElementById(
            "lightbox-img"
        );

    if (
        !image ||
        !lightbox ||
        !lightboxImage
    ) {
        return;
    }

    lightboxImage.src =
        image.currentSrc ||
        image.src;

    lightboxImage.alt =
        image.alt ||
        "Fotografía ampliada";

    lightbox.classList.add("active");

    document.body.style.overflow =
        "hidden";
};

window.closeLightbox = function () {
    const lightbox =
        document.getElementById(
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
    const audio =
        document.getElementById(
            "wedding-audio"
        );

    const player =
        document.getElementById(
            "audio-player"
        );

    const playButton =
        document.getElementById(
            "audio-play-button"
        );

    const volumeButton =
        document.getElementById(
            "audio-volume-button"
        );

    const progress =
        document.getElementById(
            "audio-progress"
        );

    const currentTimeElement =
        document.getElementById(
            "audio-current-time"
        );

    const durationElement =
        document.getElementById(
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

    function formatAudioTime(
        seconds
    ) {
        if (
            !Number.isFinite(seconds)
        ) {
            return "00:00";
        }

        const minutes =
            Math.floor(
                seconds / 60
            );

        const remainingSeconds =
            Math.floor(
                seconds % 60
            );

        return `${
            String(minutes).padStart(
                2,
                "0"
            )
        }:${
            String(
                remainingSeconds
            ).padStart(
                2,
                "0"
            )
        }`;
    }

    function updateDuration() {
        if (!durationElement) {
            return;
        }

        durationElement.textContent =
            formatAudioTime(
                audio.duration
            );
    }

    function updateProgress() {
        if (
            !Number.isFinite(
                audio.duration
            ) ||
            audio.duration <= 0
        ) {
            return;
        }

        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;

        progress.value =
            String(percentage);

        progress.style.setProperty(
            "--audio-progress",
            `${percentage}%`
        );

        if (currentTimeElement) {
            currentTimeElement.textContent =
                formatAudioTime(
                    audio.currentTime
                );
        }
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

    audio.addEventListener(
        "play",
        () => {
            player.classList.add(
                "is-playing"
            );

            playButton.setAttribute(
                "aria-label",
                "Pausar canción"
            );
        }
    );

    audio.addEventListener(
        "pause",
        () => {
            player.classList.remove(
                "is-playing"
            );

            playButton.setAttribute(
                "aria-label",
                "Reproducir canción"
            );
        }
    );

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

    progress.addEventListener(
        "input",
        () => {
            if (
                !Number.isFinite(
                    audio.duration
                ) ||
                audio.duration <= 0
            ) {
                return;
            }

            const percentage =
                Number(progress.value);

            audio.currentTime =
                (
                    percentage /
                    100
                ) *
                audio.duration;

            progress.style.setProperty(
                "--audio-progress",
                `${percentage}%`
            );
        }
    );

    volumeButton.addEventListener(
        "click",
        () => {
            audio.muted =
                !audio.muted;

            player.classList.toggle(
                "is-muted",
                audio.muted
            );

            volumeButton.textContent =
                audio.muted
                    ? "×"
                    : "♫";

            volumeButton.setAttribute(
                "aria-label",
                audio.muted
                    ? "Activar sonido"
                    : "Silenciar canción"
            );
        }
    );

    audio.addEventListener(
        "ended",
        () => {
            player.classList.remove(
                "is-playing"
            );

            progress.value = "0";

            progress.style.setProperty(
                "--audio-progress",
                "0%"
            );

            if (currentTimeElement) {
                currentTimeElement.textContent =
                    "00:00";
            }
        }
    );
}


/* =====================================================
   MAPAS DESPLEGABLES
===================================================== */

window.showMap = function (
    containerId,
    coordinates
) {
    const mapContainer =
        document.getElementById(
            containerId
        );

    if (!mapContainer) {
        return;
    }

    const isOpen =
        mapContainer.classList.contains(
            "is-open"
        );

    if (isOpen) {
        mapContainer.classList.remove(
            "is-open"
        );

        mapContainer.innerHTML = `
            <button
                type="button"
                class="map-toggle"
                aria-expanded="false"
                onclick="showMap(
                    '${containerId}',
                    '${coordinates}'
                )"
            >
                <span
                    class="map-toggle-icon"
                    aria-hidden="true"
                >
                    📍
                </span>

                <span>
                    Ver mapa
                </span>
            </button>
        `;

        return;
    }

    mapContainer.classList.add(
        "is-open"
    );

    const mapURL =
        `https://www.google.com/maps?q=${
            encodeURIComponent(
                coordinates
            )
        }&z=16&output=embed`;

    mapContainer.innerHTML = `
        <div class="map-expanded">

            <iframe
                src="${mapURL}"
                title="Mapa de ubicación"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
            ></iframe>

            <button
                type="button"
                class="map-close-button"
                aria-label="Cerrar mapa"
                onclick="showMap(
                    '${containerId}',
                    '${coordinates}'
                )"
            >
                Cerrar mapa
            </button>

        </div>
    `;
};


/* =====================================================
   APERTURA DE LA INVITACIÓN
===================================================== */

function initInvitationOpening() {
    const cover =
        document.getElementById(
            "invitation-cover"
        );

    const openButton =
        document.getElementById(
            "open-invitation"
        );

    if (
        !cover ||
        !openButton
    ) {
        return;
    }

    document.body.classList.add(
        "invitation-closed"
    );

    openButton.addEventListener(
        "click",
        () => {
            cover.classList.add(
                "is-opening"
            );

            document.body.classList.remove(
                "invitation-closed"
            );

            document.body.classList.add(
                "invitation-open"
            );

            window.setTimeout(
                () => {
                    cover.classList.add(
                        "is-hidden"
                    );
                },
                3000
            );

            window.setTimeout(
                () => {
                    cover.remove();

                    document.body.style.overflow =
                        "";
                },
                4000
            );
        },
        {
            once: true
        }
    );
}


/* =====================================================
   FORMULARIO PRIVADO PARA REGALOS
===================================================== */

function configureGiftForm() {
    const giftButton =
        document.getElementById(
            "gift-form-button"
        );

    if (!giftButton) {
        return;
    }

    const formBaseURL =
        "https://docs.google.com/forms/d/e/1FAIpQLSfcSfTX_YKVaqRev6ps2Wc9wEB-q-EAMc1zO4zfWc1In1Agxw/viewform";

    const formParams =
        new URLSearchParams({
            usp: "pp_url",

            "entry.988199634":
                guestData.nombre,

            "entry.1231225220":
                guestData.codigo,

            "entry.995696210":
                "Ambas opciones"
        });

    giftButton.href =
        `${formBaseURL}?${formParams.toString()}`;

    if (!guestData.codigo) {
        giftButton.href = "#";

        giftButton.removeAttribute(
            "target"
        );

        giftButton.setAttribute(
            "aria-disabled",
            "true"
        );

        giftButton.classList.add(
            "is-disabled"
        );

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
   PERSONALIZACIÓN DEL INVITADO
===================================================== */

function initGuestPersonalization() {
    const guestName =
        guestData.nombre;

    const passesValue =
        Number.parseInt(
            guestData.pases,
            10
        );

    const passes =
        Number.isInteger(
            passesValue
        ) &&
        passesValue > 0
            ? passesValue
            : 0;

    const letterGuest =
        document.getElementById(
            "invitation-guest-name"
        );

    const heroGreeting =
        document.getElementById(
            "guest-greeting"
        );

    const guestCard =
        document.getElementById(
            "guest-invitation-card"
        );

    const guestCardName =
        document.getElementById(
            "guest-card-name"
        );

    const guestCardPasses =
        document.getElementById(
            "guest-card-passes"
        );

    const passIcons =
        document.getElementById(
            "guest-pass-icons"
        );

    if (!guestName) {
        if (letterGuest) {
            letterGuest.textContent =
                "Nuestros familiares y amigos";
        }

        if (heroGreeting) {
            heroGreeting.textContent =
                "";
        }

        if (guestCard) {
            guestCard.hidden = true;
        }

        return;
    }

    if (letterGuest) {
        letterGuest.textContent =
            guestName;
    }

    if (heroGreeting) {
        heroGreeting.textContent =
            `Bienvenidos, ${guestName}`;
    }

    if (
        !guestCard ||
        !guestCardName ||
        !guestCardPasses
    ) {
        return;
    }

    guestCard.hidden = false;

    guestCard.removeAttribute(
        "hidden"
    );

    guestCardName.textContent =
        guestName;

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

    if (
        !passIcons ||
        passes <= 0
    ) {
        return;
    }

    passIcons.innerHTML = "";

    const visiblePasses =
        Math.min(
            passes,
            10
        );

    for (
        let index = 0;
        index < visiblePasses;
        index += 1
    ) {
        const icon =
            document.createElement(
                "span"
            );

        icon.className =
            "guest-pass-icon";

        icon.textContent =
            "♥";

        icon.style.animationDelay =
            `${index * 90}ms`;

        passIcons.appendChild(icon);
    }
}


/* =====================================================
   FORMULARIO PERSONALIZADO DE ASISTENCIA
===================================================== */

function configureRSVPForm() {
    const rsvpButton =
        document.getElementById(
            "rsvp-form-button"
        );

    const warning =
        document.getElementById(
            "rsvp-form-warning"
        );

    if (!rsvpButton) {
        return;
    }

    const guestName =
        guestData.nombre;

    const guestCode =
        guestData.codigo;

    const passesValue =
        Number.parseInt(
            guestData.pases,
            10
        );

    const validPasses =
        Number.isInteger(
            passesValue
        ) &&
        passesValue >= 1 &&
        passesValue <= 20;

    const invitationIsValid =
        Boolean(guestName) &&
        Boolean(guestCode) &&
        validPasses;

    if (!invitationIsValid) {
        rsvpButton.href = "#";

        rsvpButton.removeAttribute(
            "target"
        );

        rsvpButton.classList.add(
            "is-disabled"
        );

        rsvpButton.setAttribute(
            "aria-disabled",
            "true"
        );

        if (warning) {
            warning.hidden = false;
        }

        rsvpButton.addEventListener(
            "click",
            event => {
                event.preventDefault();

                if (warning) {
                    warning.hidden = false;
                }
            }
        );

        return;
    }

    const formBaseURL =
        "https://docs.google.com/forms/d/e/1FAIpQLSfxyaz7drSzgiMviKdOuDYxbv3Oo6Djhbj-38066ikbl6WSmA/viewform";

    const formParams =
        new URLSearchParams({
            usp: "pp_url",

            "entry.444096586":
                guestName,

            "entry.120770457":
                String(passesValue),

            "entry.1314277754":
                guestCode
        });

    rsvpButton.href =
        `${formBaseURL}?${formParams.toString()}`;

    rsvpButton.target =
        "_blank";

    rsvpButton.classList.remove(
        "is-disabled"
    );

    rsvpButton.removeAttribute(
        "aria-disabled"
    );

    if (warning) {
        warning.hidden = true;
    }
}


/* =====================================================
   RESUMEN PERSONALIZADO DEL RSVP
===================================================== */

function showRSVPSummary() {
    const summary =
        document.getElementById(
            "rsvp-summary"
        );

    const summaryName =
        document.getElementById(
            "rsvp-summary-name"
        );

    const summaryPasses =
        document.getElementById(
            "rsvp-summary-passes"
        );

    if (
        !summary ||
        !summaryName ||
        !summaryPasses
    ) {
        return;
    }

    const guestName =
        guestData.nombre;

    const passes =
        Number.parseInt(
            guestData.pases,
            10
        );

    if (!guestName) {
        summary.hidden = true;
        return;
    }

    summaryName.textContent =
        guestName;

    if (passes === 1) {
        summaryPasses.textContent =
            "Tienes 1 lugar reservado.";
    } else if (
        Number.isInteger(passes) &&
        passes > 1
    ) {
        summaryPasses.textContent =
            `Tienen ${passes} lugares reservados.`;
    } else {
        summaryPasses.textContent =
            "Consulta la cantidad de lugares asignados.";
    }

    summary.hidden = false;

    summary.removeAttribute(
        "hidden"
    );
}


/* =====================================================
   MENSAJE DINÁMICO SEGÚN LA FECHA
===================================================== */

function updateWeddingStatusMessage() {
    const messageElement =
        document.getElementById(
            "wedding-status-message"
        );

    if (!messageElement) {
        return;
    }

    const weddingDate = new Date(
        "2026-10-24T12:00:00-05:00"
    );

    const difference =
        weddingDate.getTime() -
        Date.now();

    const totalDays = Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );

    let message = "";

    if (totalDays < 0) {
        message =
            "Gracias por haber sido parte de nuestro gran día.";
    } else if (totalDays === 0) {
        message =
            "¡Hoy es nuestro gran día!";
    } else if (totalDays === 1) {
        message =
            "¡Mañana nos casamos!";
    } else if (totalDays <= 7) {
        message =
            `¡Faltan solo ${totalDays} días!`;
    } else if (totalDays <= 30) {
        message =
            "Estamos a menos de un mes de celebrar juntos.";
    } else if (totalDays <= 60) {
        message =
            "Cada vez falta menos para nuestro gran día.";
    } else {
        message =
            "Contamos los días para celebrar junto a ustedes.";
    }

    messageElement.textContent =
        message;
}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initInvitationOpening();
        initAudioPlayer();
        initGuestPersonalization();
        startCountdown();
        initRevealAnimations();
        configureGiftForm();
        configureRSVPForm();
        showRSVPSummary();
        updateWeddingStatusMessage();

        document.addEventListener(
            "keydown",
            event => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    window.closeLightbox();
                }
            }
        );
    }
);
function toggleFlip(card){
    card.classList.toggle("is-flipped");
}