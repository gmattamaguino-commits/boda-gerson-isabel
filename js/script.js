"use strict";

/* =====================================================
   DATOS PERSONALIZADOS DEL INVITADO
   Ejemplo:
   ?n=Familia%20Pérez&p=4&codigo=GI26-001
===================================================== */

function getGuestData() {
    const params = new URLSearchParams(window.location.search);

    return {
        nombre: (params.get("n") || "").trim(),
        pases: (params.get("p") || "").trim(),
        codigo: (params.get("codigo") || "").trim()
    };
}

const guestData = getGuestData();


/* =====================================================
   APERTURA DE LA INVITACIÓN
===================================================== */

function initInvitationOpening() {
    const cover = document.getElementById("invitation-cover");
    const openButton = document.getElementById("open-invitation");
    const welcomeMessage = document.getElementById("invitation-welcome");

    const closedImage = document.querySelector(
        ".envelope-image-closed"
    );

    const openImage = document.querySelector(
        ".envelope-image-open"
    );

    if (
        !cover ||
        !openButton ||
        !welcomeMessage ||
        !closedImage ||
        !openImage
    ) {
        return;
    }

    document.body.classList.add("invitation-closed");
    openButton.disabled = true;

    async function prepareImages() {
        const images = [
            closedImage,
            openImage
        ];

        await Promise.all(
            images.map(async image => {
                if (!image.complete) {
                    await new Promise(resolve => {
                        image.addEventListener(
                            "load",
                            resolve,
                            {
                                once: true
                            }
                        );

                        image.addEventListener(
                            "error",
                            resolve,
                            {
                                once: true
                            }
                        );
                    });
                }

                if (typeof image.decode === "function") {
                    try {
                        await image.decode();
                    } catch (error) {
                        /*
                         * La imagen puede estar cargada
                         * aunque decode() falle.
                         */
                    }
                }
            })
        );

        cover.classList.add("is-ready");
        openButton.disabled = false;
    }

    prepareImages().catch(() => {
        openButton.disabled = false;
    });

    openButton.addEventListener(
        "click",
        () => {
            if (openButton.disabled) {
                return;
            }

            openButton.disabled = true;

            cover.classList.add("is-opening");

            window.setTimeout(
                () => {
                    cover.classList.add("is-open");

                    welcomeMessage.setAttribute(
                        "aria-hidden",
                        "false"
                    );
                },
                620
            );

            /*
             * Tiempo visible del sobre abierto.
             */
            window.setTimeout(
                () => {
                    cover.classList.add("is-leaving");

                    document.body.classList.remove(
                        "invitation-closed"
                    );

                    document.body.classList.add(
                        "invitation-open"
                    );
                },
                2500
            );

            /*
             * Se elimina la portada y aparece el hero.
             */
            window.setTimeout(
                () => {
                    cover.remove();

                    document.body.style.overflow = "";

                    /*
                     * No forzar el regreso al inicio:
                     * el visitante puede haber comenzado a deslizar
                     * mientras termina la animación del sobre.
                     */
                },
                4300
            );
        },
        {
            once: true
        }
    );
}


/* =====================================================
   CUENTA REGRESIVA
===================================================== */

function startCountdown() {
    const countdown = document.querySelector(".countdown");

    if (!countdown) {
        return;
    }

    const weddingDate = new Date(
        "2026-10-24T12:00:00-05:00"
    ).getTime();

    function updateCountdown() {
        const distance = weddingDate - Date.now();

        if (distance <= 0) {
            countdown.innerHTML = `
                <h3 class="countdown-finished">
                    <svg class="countdown-finished-icon line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="10" cy="13" r="6"></circle>
                        <circle cx="15" cy="13" r="6"></circle>
                        <path d="m8 5 2-3 2 3M13 5l2-3 2 3"></path>
                    </svg>
                    ¡Hoy es nuestro gran día!
                </h3>
            `;

            return false;
        }

        const values = {
            days: Math.floor(
                distance /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ),

            hours: Math.floor(
                (
                    distance %
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                ) /
                (
                    1000 *
                    60 *
                    60
                )
            ),

            minutes: Math.floor(
                (
                    distance %
                    (
                        1000 *
                        60 *
                        60
                    )
                ) /
                (
                    1000 *
                    60
                )
            ),

            seconds: Math.floor(
                (
                    distance %
                    (
                        1000 *
                        60
                    )
                ) /
                1000
            )
        };

        Object.entries(values).forEach(
            ([id, value]) => {
                const element =
                    document.getElementById(id);

                if (!element) {
                    return;
                }

                element.textContent =
                    id === "days"
                        ? String(value)
                        : String(value).padStart(
                            2,
                            "0"
                        );
            }
        );

        return true;
    }

    if (!updateCountdown()) {
        return;
    }

    const timer = window.setInterval(
        () => {
            if (!updateCountdown()) {
                window.clearInterval(timer);
            }
        },
        1000
    );
}


/* =====================================================
   PERSONALIZACIÓN DEL INVITADO Y PASES
===================================================== */

function initGuestPersonalization() {
    const guestName = guestData.nombre;

    const parsedPasses =
        Number.parseInt(
            guestData.pases,
            10
        );

    const passes =
        Number.isInteger(parsedPasses) &&
        parsedPasses > 0
            ? parsedPasses
            : 0;

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

    const letterGuest =
        document.getElementById(
            "invitation-guest-name"
        );

    if (!guestName) {
        if (letterGuest) {
            letterGuest.textContent =
                "Familiares y amigos";
        }

        if (guestCard) {
            guestCard.hidden = true;
        }

        return;
    }

    if (letterGuest) {
        letterGuest.textContent = guestName;
    }

    if (
        !guestCard ||
        !guestCardName ||
        !guestCardPasses
    ) {
        return;
    }

    guestCard.hidden = false;
    guestCard.removeAttribute("hidden");

    guestCardName.textContent = guestName;

    guestCardPasses.textContent =
        passes > 0
            ? String(passes)
            : "—";

    if (passIcons) {
        passIcons.innerHTML = "";
    }
}


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

    function formatAudioTime(seconds) {
        if (!Number.isFinite(seconds)) {
            return "00:00";
        }

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60);

        return `${
            String(minutes).padStart(
                2,
                "0"
            )
        }:${
            String(remainingSeconds).padStart(
                2,
                "0"
            )
        }`;
    }

    function updateDuration() {
        if (durationElement) {
            durationElement.textContent =
                formatAudioTime(
                    audio.duration
                );
        }
    }

    function updateProgress() {
        if (
            !Number.isFinite(audio.duration) ||
            audio.duration <= 0
        ) {
            return;
        }

        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) *
            100;

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
                !Number.isFinite(audio.duration) ||
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
            audio.muted = !audio.muted;

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

            element.style.setProperty(
                "--reveal-delay",
                `${(index % 4) * 90}ms`
            );
        }
    );

    if (!("IntersectionObserver" in window)) {
        elements.forEach(
            element => {
                element.classList.add(
                    "is-visible"
                );
            }
        );

        return;
    }

    const observer =
        new IntersectionObserver(
            (
                entries,
                currentObserver
            ) => {
                entries.forEach(
                    entry => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        currentObserver.unobserve(
                            entry.target
                        );
                    }
                );
            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -40px 0px"
            }
        );

    elements.forEach(
        element => {
            observer.observe(element);
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
                    <svg class="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="2.5"></circle>
                    </svg>
                </span>

                <span>
                    Ver mapa
                </span>
            </button>
        `;

        return;
    }

    mapContainer.classList.add("is-open");

    const mapURL =
        `https://www.google.com/maps?q=${
            encodeURIComponent(coordinates)
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
   GALERÍA Y LIGHTBOX
===================================================== */

window.openLightbox = function (
    galleryItem
) {
    const image =
        galleryItem?.querySelector("img");

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
   TARJETAS GIRATORIAS DEL DRESS CODE
===================================================== */

let currentGalleryIndex = 0;
let lightboxReturnFocus = null;

function getGalleryImages() {
    return Array.from(document.querySelectorAll(".gallery-item img"));
}

function showLightboxImage(index, direction = 0) {
    const images = getGalleryImages();
    const image = document.getElementById("lightbox-img");
    const counter = document.getElementById("lightbox-counter");
    if (!images.length || !image) return;
    currentGalleryIndex = (index + images.length) % images.length;
    const source = images[currentGalleryIndex];
    const galleryItem = source.closest(".gallery-item");
    const fullSource = galleryItem?.dataset.full || source.currentSrc || source.src;
    image.classList.remove("slide-from-left", "slide-from-right");
    void image.offsetWidth;
    if (direction) image.classList.add(direction > 0 ? "slide-from-right" : "slide-from-left");
    image.src = fullSource;
    image.alt = source.alt || `Fotografía ${currentGalleryIndex + 1}`;
    if (counter) counter.textContent = `${currentGalleryIndex + 1} de ${images.length}`;

    [-1, 1].forEach(offset => {
        const adjacentIndex = (currentGalleryIndex + offset + images.length) % images.length;
        const adjacentItem = images[adjacentIndex].closest(".gallery-item");
        const adjacentSource = adjacentItem?.dataset.full;
        if (adjacentSource) {
            const preload = new Image();
            preload.src = adjacentSource;
        }
    });
}

window.navigateLightbox = direction => showLightboxImage(currentGalleryIndex + direction, direction);

window.openLightbox = function (galleryItem) {
    const lightbox = document.getElementById("lightbox");
    const images = getGalleryImages();
    const image = galleryItem?.querySelector("img");
    if (!image || !lightbox || !images.length) return;
    lightboxReturnFocus = galleryItem;
    showLightboxImage(images.indexOf(image));
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("lightbox-close")?.focus();
};

window.closeLightbox = function () {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lightbox.classList.remove("active", "is-dragging");
    lightbox.style.removeProperty("--lightbox-drag-y");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxReturnFocus?.focus?.();
};

function initAdvancedGallery() {
    const lightbox = document.getElementById("lightbox");
    const stage = document.getElementById("lightbox-stage");
    if (!lightbox || !stage) return;

    getGalleryImages().forEach(image => {
        const revealImage = () => image.classList.add("is-loaded");
        if (image.complete) revealImage();
        else image.addEventListener("load", revealImage, { once: true });
    });

    document.getElementById("lightbox-close")?.addEventListener("click", window.closeLightbox);
    document.getElementById("lightbox-prev")?.addEventListener("click", () => window.navigateLightbox(-1));
    document.getElementById("lightbox-next")?.addEventListener("click", () => window.navigateLightbox(1));
    lightbox.addEventListener("click", event => { if (event.target === lightbox) window.closeLightbox(); });

    let startX = 0;
    let startY = 0;
    stage.addEventListener("pointerdown", event => {
        startX = event.clientX; startY = event.clientY;
        stage.setPointerCapture?.(event.pointerId);
        lightbox.classList.add("is-dragging");
    });
    stage.addEventListener("pointermove", event => {
        if (!lightbox.classList.contains("is-dragging")) return;
        const deltaY = Math.max(0, event.clientY - startY);
        lightbox.style.setProperty("--lightbox-drag-y", `${Math.min(deltaY, 120)}px`);
    });
    stage.addEventListener("pointerup", event => {
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        lightbox.classList.remove("is-dragging");
        lightbox.style.removeProperty("--lightbox-drag-y");
        if (deltaY > 90 && Math.abs(deltaY) > Math.abs(deltaX)) window.closeLightbox();
        else if (Math.abs(deltaX) > 55) window.navigateLightbox(deltaX < 0 ? 1 : -1);
    });
    document.addEventListener("keydown", event => {
        if (!lightbox.classList.contains("active")) return;
        if (event.key === "ArrowLeft") window.navigateLightbox(-1);
        if (event.key === "ArrowRight") window.navigateLightbox(1);
    });
}

function initElegantMicroAnimations() {
    const timeline = document.querySelector(".schedule-grid");
    if (!timeline) return;

    if (!("IntersectionObserver" in window)) {
        timeline.classList.add("timeline-animated");
        return;
    }

    const timelineObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("timeline-animated");
            timelineObserver.unobserve(entry.target);
        });
    }, { threshold: .18, rootMargin: "0px 0px -50px 0px" });

    timelineObserver.observe(timeline);
}

/* =====================================================
   FORMULARIO DE ASISTENCIA
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
        Number.isInteger(passesValue) &&
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

    rsvpButton.target = "_blank";

    rsvpButton.rel =
        "noopener noreferrer";

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
   TARJETA DE DATOS PARA REGALO MONETARIO
===================================================== */

function initGiftAccountCard() {
    const card = document.getElementById("gift-card");
    const showButton = document.getElementById("gift-data-button");
    const backButton = document.getElementById("gift-back-button");
    const details = document.getElementById("gift-account-details");
    const status = document.getElementById("gift-copy-status");

    if (!card || !showButton || !backButton || !details) {
        return;
    }

    function setExpanded(expanded) {
        card.classList.toggle("is-expanded", expanded);
        showButton.setAttribute("aria-expanded", String(expanded));
        details.setAttribute("aria-hidden", String(!expanded));
        details.toggleAttribute("inert", !expanded);

        if (!expanded && status) {
            status.textContent = "";
        }
    }

    setExpanded(false);

    showButton.addEventListener("click", event => {
        event.preventDefault();
        setExpanded(true);

        window.setTimeout(
            () => details.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                block: "nearest"
            }),
            120
        );
    });

    backButton.addEventListener("click", event => {
        event.preventDefault();
        setExpanded(false);
        showButton.focus({ preventScroll: true });
    });

    card.querySelectorAll(".gift-copy-button").forEach(button => {
        button.addEventListener("click", async () => {
            const value = button.dataset.copyValue || "";

            try {
                await navigator.clipboard.writeText(value);
            } catch (_) {
                const temporaryInput = document.createElement("textarea");
                temporaryInput.value = value;
                temporaryInput.setAttribute("readonly", "");
                temporaryInput.style.position = "fixed";
                temporaryInput.style.opacity = "0";
                document.body.appendChild(temporaryInput);
                temporaryInput.select();
                document.execCommand("copy");
                temporaryInput.remove();
            }

            if (status) {
                status.textContent =
                    button.getAttribute("aria-label") === "Copiar CCI"
                        ? "CCI copiado"
                        : "Número de cuenta copiado";
            }

            const label = button.querySelector("span");
            if (label) {
                const originalText = label.textContent;
                label.textContent = "Copiado";
                window.setTimeout(() => {
                    label.textContent = originalText;
                }, 1600);
            }
        });
    });
}

/* =====================================================
   RESUMEN DEL RSVP
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
    summary.removeAttribute("hidden");
}


/* =====================================================
   MENSAJE SEGÚN LA FECHA
===================================================== */

function updateWeddingStatusMessage() {
    const messageElement =
        document.getElementById(
            "wedding-status-message"
        );

    if (!messageElement) {
        return;
    }

    const weddingDate =
        new Date(
            "2026-10-24T12:00:00-05:00"
        );

    const difference =
        weddingDate.getTime() -
        Date.now();

    const totalDays =
        Math.ceil(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
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
   CONTROLES DEL TECLADO
===================================================== */

function initKeyboardControls() {
    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Escape" &&
                typeof window.closeLightbox ===
                    "function"
            ) {
                window.closeLightbox();
            }
        }
    );
}
/* =====================================================
   HOJAS NATURALES — CAÍDA CONSTANTE
===================================================== */

function initFallingLeaves() {
    const overlay = document.getElementById("leaf-overlay");
    const hero = document.querySelector(".hero");

    if (!overlay || !hero) {
        return;
    }

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        return;
    }

    let spawnTimer = null;
    let controlTimer = null;
    let leavesAreActive = false;

    /*
     * Cantidad máxima y mínima de hojas visibles.
     * Puedes modificarlas para aumentar o reducir
     * la presencia de la animación.
     */
    const MAX_LEAVES = 22;
    const MIN_LEAVES = 8;

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function chooseWeightedColor() {
        const value = Math.random();

        /*
         * Distribución según la paleta:
         * 46% verde salvia
         * 20% rosa malva
         * 18% rosa canela
         * 10% guinda
         * 6% blanco perla
         */

        if (value < 0.46) {
            return "color-sage";
        }

        if (value < 0.66) {
            return "color-mauve";
        }

        if (value < 0.84) {
            return "color-cinnamon";
        }

        if (value < 0.94) {
            return "color-wine";
        }

        return "color-pearl";
    }

    function chooseShape() {
        const shapes = [
            "shape-natural",
            "shape-slender",
            "shape-round",
            "shape-curved"
        ];

        return shapes[
            Math.floor(
                Math.random() * shapes.length
            )
        ];
    }

    function createLeaf(options = {}) {
        if (!leavesAreActive) {
            return;
        }

        if (
            overlay.childElementCount >=
            MAX_LEAVES
        ) {
            return;
        }

        const leaf = document.createElement("span");

        leaf.classList.add(
            "falling-leaf",
            chooseShape(),
            chooseWeightedColor()
        );

        const baseDrift = random(-55, 55);

        const oppositeDrift =
            baseDrift * random(-0.75, -0.35);

        /*
         * Posición horizontal inicial.
         */
        leaf.style.left = `${random(1, 98)}vw`;

        /*
         * Hojas pequeñas y delicadas.
         */
        leaf.style.setProperty(
            "--leaf-size",
            `${random(12, 18).toFixed(1)}px`
        );

        leaf.style.setProperty(
            "--leaf-size-mobile",
            `${random(10, 15).toFixed(1)}px`
        );

        leaf.style.setProperty(
            "--leaf-scale",
            random(0.86, 1.12).toFixed(2)
        );

        /*
         * Transparencia elegante.
         */
        leaf.style.setProperty(
            "--leaf-opacity",
            random(0.25, 0.48).toFixed(2)
        );

        /*
         * Duración variada para evitar que todas
         * lleguen al final simultáneamente.
         */
        leaf.style.setProperty(
            "--fall-duration",
            `${random(12.5, 18).toFixed(2)}s`
        );

        /*
         * Las hojas iniciales reciben un retraso
         * negativo para llenar distintas alturas
         * de la pantalla desde el comienzo.
         *
         * Las hojas normales empiezan desde arriba.
         */
        const initialDelay = options.initial
            ? random(-12, -1)
            : 0;

        leaf.style.setProperty(
            "--leaf-delay",
            `${initialDelay.toFixed(2)}s`
        );

        leaf.style.setProperty(
            "--start-rotation",
            `${random(-160, 160).toFixed(0)}deg`
        );

        leaf.style.setProperty(
            "--start-tilt",
            `${random(-48, 48).toFixed(0)}deg`
        );

        leaf.style.setProperty(
            "--vein-angle",
            `${random(-9, 9).toFixed(1)}deg`
        );

        /*
         * Movimiento irregular de izquierda
         * a derecha durante la caída.
         */
        leaf.style.setProperty(
            "--drift-one",
            `${(baseDrift * 0.58).toFixed(0)}px`
        );

        leaf.style.setProperty(
            "--drift-two",
            `${oppositeDrift.toFixed(0)}px`
        );

        leaf.style.setProperty(
            "--drift-three",
            `${(baseDrift * 1.05).toFixed(0)}px`
        );

        leaf.style.setProperty(
            "--drift-end",
            `${(baseDrift * 1.42).toFixed(0)}px`
        );

        const rotationDirection =
            Math.random() < 0.5 ? -1 : 1;

        leaf.style.setProperty(
            "--rotation-one",
            `${
                rotationDirection *
                random(45, 95)
            }deg`
        );

        leaf.style.setProperty(
            "--rotation-two",
            `${
                rotationDirection *
                random(120, 185)
            }deg`
        );

        leaf.style.setProperty(
            "--rotation-three",
            `${
                rotationDirection *
                random(205, 290)
            }deg`
        );

        leaf.style.setProperty(
            "--rotation-end",
            `${
                rotationDirection *
                random(310, 430)
            }deg`
        );

        overlay.appendChild(leaf);

        leaf.addEventListener(
            "animationend",
            function () {
                leaf.remove();
            },
            {
                once: true
            }
        );
    }

    /*
     * Generación continua con tiempos ligeramente
     * diferentes para que no parezca mecánica.
     */
    function scheduleNextLeaf() {
        if (!leavesAreActive) {
            return;
        }

        createLeaf();

        /*
         * Una hoja cada 380–620 milisegundos.
         */
        const nextDelay = random(380, 620);

        spawnTimer = window.setTimeout(
            scheduleNextLeaf,
            nextDelay
        );
    }

    /*
     * Control adicional:
     * si por casualidad quedan pocas hojas,
     * crea nuevas inmediatamente.
     */
    function maintainLeafFlow() {
        if (!leavesAreActive) {
            return;
        }

        const currentLeaves =
            overlay.childElementCount;

        if (currentLeaves < MIN_LEAVES) {
            const missingLeaves =
                MIN_LEAVES - currentLeaves;

            for (
                let index = 0;
                index < missingLeaves;
                index += 1
            ) {
                window.setTimeout(
                    function () {
                        createLeaf();
                    },
                    index * 100
                );
            }
        }
    }

    function startLeaves() {
        if (leavesAreActive) {
            return;
        }

        leavesAreActive = true;

        document.body.classList.add(
            "leaves-active"
        );

        /*
         * Crea hojas repartidas por toda la pantalla
         * para evitar un inicio vacío.
         */
        for (
            let index = 0;
            index < 12;
            index += 1
        ) {
            window.setTimeout(
                function () {
                    createLeaf({
                        initial: true
                    });
                },
                index * 90
            );
        }

        /*
         * Comienza el flujo constante.
         */
        spawnTimer = window.setTimeout(
            scheduleNextLeaf,
            250
        );

        /*
         * Comprueba regularmente que nunca
         * queden pocas hojas.
         */
        controlTimer = window.setInterval(
            maintainLeafFlow,
            700
        );
    }

    function stopLeaves() {
        leavesAreActive = false;

        document.body.classList.remove(
            "leaves-active"
        );

        if (spawnTimer) {
            window.clearTimeout(spawnTimer);
            spawnTimer = null;
        }

        if (controlTimer) {
            window.clearInterval(controlTimer);
            controlTimer = null;
        }

        overlay.replaceChildren();
    }

    /*
     * Las hojas se activan después de salir del hero.
     */
    const observer = new IntersectionObserver(
        function (entries) {
            const heroEntry = entries[0];

            if (heroEntry.isIntersecting) {
                stopLeaves();
            } else {
                startLeaves();
            }
        },
        {
            threshold: 0.08
        }
    );

    observer.observe(hero);
}
/* =====================================================
   INICIALIZACIÓN GENERAL
===================================================== */

function initInvitationEnhancements() {
    const paths = {
        church:'<path d="M4 21h16M6 21V10l6-5 6 5v11M9 21v-6h6v6M12 2v5M9.5 4.5h5"/>',
        party:'<path d="M4 20 9 7l8 8-13 5ZM9 7l8-3M14 12l6-2M15 4l1-2M20 8l2 1"/>',
        toast:'<path d="M3 3h8l-1 7a3 3 0 0 1-6 0L3 3ZM7 13v6M4 21h6M13 3h8l-1 7a3 3 0 0 1-6 0l-1-7ZM17 13v6M14 21h6"/>',
        dinner:'<path d="M6 3v7M3 3v5a3 3 0 0 0 6 0V3M6 10v11M15 3v18M15 3c4 2 4 8 0 10"/>',
        music:'<path d="M9 18V5l10-2v13M9 9l10-2M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM16 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>',
        suit:'<path d="M8 3l4 3 4-3 3 4-2 14H7L5 7l3-4ZM12 6v15M9 10l3 3 3-3"/>',
        dress:'<path d="M9 3h6l-1 6 5 12H5l5-12-1-6ZM10 9h4"/>',
        gift:'<path d="M3 9h18v12H3V9ZM2 5h20v4H2V5ZM12 5v16M12 5c-3 0-5-1-5-3 3-1 5 0 5 3ZM12 5c3 0 5-1 5-3-3-1-5 0-5 3Z"/>',
        children:'<circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7M9 8h.01M15 8h.01M10 11c1 .7 3 .7 4 0"/>',
        pin:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>'
    };
    const icon = name => '<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round">' + paths[name] + '</svg>';
    const replaceIcons = (selector, names) => document.querySelectorAll(selector).forEach((el, i) => { el.innerHTML = icon(names[i] || names[0]); });
    replaceIcons('.schedule-card-icon', ['church','party','toast','dinner','music']);
    replaceIcons('.place-icon', ['church','party']);
    replaceIcons('.dresscode-icon', ['suit','dress']);
    replaceIcons('.regalo-icon', ['gift']);
    replaceIcons('.info-ninos-icon', ['children']);
    replaceIcons('.map-toggle-icon', ['pin']);

    const guestCard = document.getElementById('guest-invitation-card');
    if (guestCard && !guestCard.querySelector('.guest-card-welcome')) {
        const welcome = document.createElement('p');
        welcome.className = 'guest-card-welcome';
        welcome.textContent = 'Nos encantará celebrar este día contigo.';
        guestCard.appendChild(welcome);
    }

    const audio = document.getElementById('wedding-audio');
    if (audio) {
        const music = document.createElement('button');
        music.type = 'button'; music.className = 'floating-control floating-music'; music.innerHTML = icon('music');
        document.body.appendChild(music);
        const sync = () => { const playing = !audio.paused; music.classList.toggle('is-playing', playing); music.setAttribute('aria-pressed', String(playing)); music.setAttribute('aria-label', playing ? 'Pausar canción' : 'Reproducir canción'); };
        music.addEventListener('click', async () => { try { if (audio.paused) await audio.play(); else audio.pause(); } catch (_) { music.setAttribute('aria-label','No se pudo reproducir la canción'); } });
        audio.addEventListener('play', sync); audio.addEventListener('pause', sync); sync();
    }

    const topButton = document.createElement('button');
    topButton.type = 'button'; topButton.className = 'floating-control back-to-top'; topButton.setAttribute('aria-label','Volver al inicio');
    topButton.innerHTML = '<svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m6 15 6-6 6 6"/></svg>';
    document.body.appendChild(topButton);
    topButton.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
    const syncControls = () => { topButton.classList.toggle('is-visible', scrollY > innerHeight * .7); document.querySelector('.floating-music')?.classList.toggle('is-visible', scrollY > 180); };
    addEventListener('scroll', syncControls, {passive:true}); syncControls();

    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        item.setAttribute('role','button'); item.setAttribute('tabindex','0'); item.setAttribute('aria-label',`Ampliar fotografía ${i+1}`);
        item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); } });
    });
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        initInvitationOpening();
        initAudioPlayer();
        initGuestPersonalization();
        startCountdown();
        initRevealAnimations();
        initGiftAccountCard();
        configureRSVPForm();
        showRSVPSummary();
        updateWeddingStatusMessage();
        initKeyboardControls();
        initFallingLeaves();
        initInvitationEnhancements();
        initAdvancedGallery();
        initElegantMicroAnimations();
    }
);
