function getGuestData(){

    const params = new URLSearchParams(window.location.search);

    const nombre = params.get("n");
    const pases = params.get("p");

    return { nombre, pases };

}

function showGuestGreeting(){

    const { nombre, pases } = getGuestData();

    const greetingEl = document.getElementById("guest-greeting");

    if(nombre && greetingEl){

        greetingEl.textContent = `Querid@s ${decodeURIComponent(nombre)}`;

    }

    return { nombre, pases };

}

const guestData = showGuestGreeting();
const weddingDate = new Date("October 24, 2026 12:00:00").getTime();

const timer = setInterval(function () {

    const now = new Date().getTime();

    const distance = weddingDate - now;

    if(distance <= 0){

        clearInterval(timer);

        document.querySelector(".countdown").innerHTML =
        "<h3>💍 ¡Hoy es nuestro gran día!</h3>";

        return;

    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = String(days).padStart(3,'0');

    document.getElementById("hours").textContent = String(hours).padStart(2,'0');

    document.getElementById("minutes").textContent = String(minutes).padStart(2,'0');

    document.getElementById("seconds").textContent = String(seconds).padStart(2,'0');

},1000);
const storyCards = document.querySelectorAll(".story-card");

const storyObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }

    });

}, { threshold: 0.15 });

storyCards.forEach((card) => storyObserver.observe(card));

const scheduleCards = document.querySelectorAll(".schedule-card");

const scheduleObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }

    });

}, { threshold: 0.15 });

scheduleCards.forEach((card) => scheduleObserver.observe(card));
const placeCards = document.querySelectorAll(".place-card");

const placeObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }

    });

}, { threshold: 0.2 });

placeCards.forEach((card) => placeObserver.observe(card));
const dresscodeCards = document.querySelectorAll(".dresscode-card");

const dresscodeObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }

    });

}, { threshold: 0.2 });

dresscodeCards.forEach((card) => dresscodeObserver.observe(card));


function showPassesMessage(){

    const passesEl = document.getElementById("rsvp-passes");

    if(!passesEl) return;

    if(guestData && guestData.pases){

        const total = parseInt(guestData.pases, 10);

        let dotsHTML = "";

        for(let i = 1; i <= total; i++){

            dotsHTML += `
                <div class="pass-dot-wrap">
                    <div class="pass-dot filled"></div>
                    <span class="pass-number">${i}</span>
                </div>
            `;

        }

        passesEl.innerHTML = `
            <p class="passes-label">Hemos reservado</p>
            <div class="passes-dots">${dotsHTML}</div>
            <p class="passes-label" style="margin-top:14px;">Lugares en su honor</p>
        `;

    }

}

showPassesMessage();
const regaloCards = document.querySelectorAll(".regalo-card");

const regaloObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }

    });

}, { threshold: 0.2 });

regaloCards.forEach((card) => regaloObserver.observe(card));
const infoNinosCard = document.querySelector(".info-ninos-card");

if(infoNinosCard){

    const infoNinosObserver = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if(entry.isIntersecting){
                entry.target.classList.add("visible");
            }

        });

    }, { threshold: 0.2 });

    infoNinosObserver.observe(infoNinosCard);

}
function openLightbox(el){

    const img = el.querySelector("img");

    if(!img || !img.src || img.naturalWidth === 0) return;

    document.getElementById("lightbox-img").src = img.src;
    document.getElementById("lightbox").classList.add("active");

}

function closeLightbox(){

    document.getElementById("lightbox").classList.remove("active");

}

const galleryItems = document.querySelectorAll(".gallery-item");

const galleryObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }

    });

}, { threshold: 0.15 });

galleryItems.forEach((item) => galleryObserver.observe(item));
function playSong(el){

    const videoId = el.dataset.video;

    const wrapper = document.createElement("div");
    wrapper.className = "song-player-embed";
    wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" title="Nuestra canción" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

    el.replaceWith(wrapper);

}
function showMap(containerId, coords){

    const container = document.getElementById(containerId);

    if(!container) return;

    container.innerHTML = `<iframe
        src="https://www.google.com/maps?q=${coords}&z=16&output=embed"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>`;

}