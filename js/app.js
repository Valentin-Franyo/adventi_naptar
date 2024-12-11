import data from "../data/data.js";

const $container = document.querySelector('.js-container');
const $btn = document.querySelector('.js-btn');
const date = new Date();
const today = date.getDate();

let days = [];

// Adatok mentése a localStorage-be
function saveToStorage() {
    localStorage.setItem("data", JSON.stringify(days));
}

// Adatok betöltése a localStorage-ből vagy a `data.js` fájlból
function initialData() {
    const storageData = localStorage.getItem("data");
    const localData = JSON.parse(storageData);

    if (localData) {
        days = localData;
    } else {
        days = data;
    }

    console.log("Betöltött napok adatai:", days); // Naplózás az ellenőrzéshez
}

// Kártya sablon létrehozása
function templateCard(day) {
    const card = document.createElement('div');
    const front = document.createElement('div');
    const back = document.createElement('div');

    card.classList = "card";

    if (day.isFlipped) {
        front.classList = "card_content card_front is-flipped";
        back.classList = "card_content card_back";
    } else {
        front.classList = "card_content card_front";
        back.classList = "card_content card_back is-flipped";
    }

    front.innerHTML = `<h2>December ${day.day}</h2>`;

    let message;
    if (day.day == 24) {
        message = "Ma van karácsony napja";
    } else {
        message = `Már csak ${24 - day.day} nap van karácsonyig`;
    }

    back.innerHTML = `
        <div class="card__header">
            <iframe
                title="YouTube video player"
                src="${day.link}"
                frameborder="0"
                allowfullscreen
                onerror="console.error('Nem sikerült betölteni a videót:', '${day.link}')"
            ></iframe>
        </div>
        <div class="card_body">
            <p>${message}</p>
        </div>
    `;

    card.appendChild(front);
    card.appendChild(back);

    // Kattintás esemény
    card.addEventListener('click', () => {
        if (day.day <= today) {
            front.classList.add("is-flipped");
            back.classList.remove("is-flipped");

            days[day.day - 1].isFlipped = true;
            saveToStorage();
        } else {
            alert("Hoooo-hooo-hooo! Ennek a dátumnak még nincs itt az ideje! Várj türelemmel, kislány!");
        }
    });

    return card;
}

// Renderelés
function render() {
    $container.innerHTML = ""; // Törlés duplikáció elkerülése végett
    for (let day of days) {
        console.log(`Renderelés: Nap ${day.day}, Link: ${day.link}`); // Ellenőrzés
        const newCard = templateCard(day);
        $container.appendChild(newCard);
    }
}

// Storage frissítés másik ablak frissítése esetén
window.addEventListener('storage', () => {
    initialData();
    render();
});

// Reset gomb esemény
$btn.addEventListener('click', () => {
    for (let day of days) {
        day.isFlipped = false;
    }

    localStorage.clear();
    render();
});

// Adatok inicializálása és renderelés
initialData();
render();
