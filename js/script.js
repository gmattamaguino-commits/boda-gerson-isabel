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

const scheduleItems = document.querySelectorAll(".schedule-item");

const scheduleObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if(entry.isIntersecting){
            entry.target.classList.add("visible");
        }

    });

}, { threshold: 0.2 });

scheduleItems.forEach((item) => scheduleObserver.observe(item));
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

        const p = parseInt(guestData.pases, 10);

        const texto = p === 1
            ? "Tienes 1 pase reservado"
            : `Tienen ${p} pases reservados`;

        passesEl.textContent = texto;

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