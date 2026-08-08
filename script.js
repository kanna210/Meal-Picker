import {
    loadMeals,
    getMeals,
    getSelectedMeal,
    setSelectedMeal,
    addMeal,
    deleteMeal,
    resetVotes
} from "./meals.js";

import {
    showVote,
    showVoteSummary,
    saveVote
} from "./votes.js";

import {
    initializeModes,
    isCrossedOut
} from "./modes.js";


const modal = document.getElementById("addMealModal");
const addMealBtn = document.getElementById("addMealBtn");
const closeModal = document.getElementById("closeModal");
const saveMealBtn = document.getElementById("saveMeal");

const mealName = document.getElementById("mealName");
const mealDesc = document.getElementById("mealDesc");
const mealImage = document.getElementById("mealImage");

const userModal = document.getElementById("userModal");
const kannaBtn = document.getElementById("kannaBtn");
const dylanBtn = document.getElementById("dylanBtn");

const mealList = document.getElementById("meal-list");
const search = document.getElementById("search");

const title = document.querySelector("#meal-details h2");
const image = document.getElementById("meal-image");
const description = document.getElementById("meal-description");

const voteSection = document.getElementById("voteSection");
const goodBtn = document.getElementById("goodBtn");
const noBtn = document.getElementById("noBtn");
const currentVote = document.getElementById("currentVote");
const voteSummary = document.getElementById("voteSummary");

const eliminateModeBtn = document.getElementById("eliminateModeBtn");
const keepModeBtn = document.getElementById("keepModeBtn");
const modeDescription = document.getElementById("modeDescription");

const randomBtn = document.getElementById("randomBtn");
const resetVotesBtn = document.getElementById("resetVotesBtn");
const deleteMealBtn = document.getElementById("deleteMealBtn");

const rouletteSound = new Audio("sounds/covington.m4a");

let currentUser = localStorage.getItem("user");


function selectMeal(meal) {
    setSelectedMeal(meal);

    updateSelectedHighlight();

    title.textContent = meal.name;
    image.src = meal.image;
    image.style.display = "block";
    description.textContent = meal.description;

    voteSection.style.display = "block";
    deleteMealBtn.style.display = "block";

    showVote(meal, currentUser, goodBtn, noBtn, currentVote);
    showVoteSummary(meal, voteSummary);
}


function displayMeals(list) {
    mealList.innerHTML = "";

    list.forEach(meal => {
        const button = document.createElement("button");

        button.className = "meal-button";
        button.textContent = meal.name;
        button.dataset.mealId = meal.id;

        const selected = getSelectedMeal();

        if (selected && selected.id === meal.id) {
            button.classList.add("selected");
        }

        button.classList.toggle(
            "crossed-out",
            isCrossedOut(meal)
        );

        button.onclick = () => selectMeal(meal);

        mealList.appendChild(button);
    });
}


function updateSelectedHighlight() {
    const selected = getSelectedMeal();

    document.querySelectorAll(".meal-button").forEach(button => {
        button.classList.toggle(
            "selected",
            selected && button.dataset.mealId === selected.id
        );
    });
}

function brownSplash() {
    const container = document.getElementById("splashEffect");

    for (let i = 0; i < 30; i++) {
        const drop = document.createElement("div");

        drop.className = "splash-drop";

        drop.style.left = "50%";
        drop.style.top = "50%";

        drop.style.setProperty(
            "--x",
            `${(Math.random() - 0.5) * window.innerWidth}px`
        );

        drop.style.setProperty(
            "--y",
            `${(Math.random() - 0.5) * window.innerHeight}px`
        );

        const size = 10 + Math.random() * 35;
        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;

        container.appendChild(drop);

        setTimeout(() => drop.remove(), 1000);
    }
}


function refreshSelectedMeal() {
    const selected = getSelectedMeal();

    if (!selected) return;

    const updated = getMeals().find(
        meal => meal.id === selected.id
    );

    if (updated) {
        selectMeal(updated);
    }
}


addMealBtn.onclick = () => {
    modal.classList.remove("hidden");
};

closeModal.onclick = () => {
    modal.classList.add("hidden");
};


saveMealBtn.onclick = async () => {
    if (mealName.value.trim() === "") {
        alert("Please enter a meal name.");
        return;
    }

    await addMeal(
        mealName.value,
        mealDesc.value,
        mealImage.value
    );

    mealName.value = "";
    mealDesc.value = "";
    mealImage.value = "";

    modal.classList.add("hidden");
};


search.addEventListener("input", () => {
    const text = search.value.toLowerCase();

    const filtered = getMeals().filter(meal =>
        meal.name.toLowerCase().includes(text)
    );

    displayMeals(filtered);
});


if (!currentUser) {
    userModal.classList.remove("hidden");
}

kannaBtn.onclick = () => {
    currentUser = "kanna";
    localStorage.setItem("user", currentUser);
    userModal.classList.add("hidden");
};

dylanBtn.onclick = () => {
    currentUser = "dylan";
    localStorage.setItem("user", currentUser);
    userModal.classList.add("hidden");
};


goodBtn.onclick = async () => {
    const meal = getSelectedMeal();

    if (!meal) return;

    await saveVote(meal, currentUser, "good");
};

noBtn.onclick = async () => {
    const meal = getSelectedMeal();

    if (!meal) return;

    await saveVote(meal, currentUser, "no");
};

currentVote.onclick = async () => {
    const meal = getSelectedMeal();

    if (!meal) return;

    await saveVote(meal, currentUser, "");
};


randomBtn.onclick = () => {
    const likedByBoth = getMeals().filter(meal =>
        meal.votes?.kanna === "good" &&
        meal.votes?.dylan === "good"
    );

    if (likedByBoth.length === 0) {
        alert("No meals have been marked Good by both of you.");
        return;
    }

    const chosenMeal =
        likedByBoth[Math.floor(Math.random() * likedByBoth.length)];

    rouletteSound.currentTime = 0;
    rouletteSound.play();

    selectMeal(chosenMeal);
    setTimeout(() => {
        brownSplash();
    }, 2000);
};


resetVotesBtn.onclick = async () => {
    const confirmed = confirm("Reset all Good and No votes?");

    if (!confirmed) return;

    await resetVotes();
};


deleteMealBtn.onclick = async () => {
    const meal = getSelectedMeal();

    if (!meal) return;

    const confirmed = confirm(`Delete ${meal.name}?`);

    if (!confirmed) return;

    await deleteMeal(meal);

    setSelectedMeal(null);

    title.textContent = "Welcome!";
    image.style.display = "none";
    description.textContent =
        "Select a meal or press Random Pick.";

    voteSection.style.display = "none";
    deleteMealBtn.style.display = "none";
};


initializeModes(
    eliminateModeBtn,
    keepModeBtn,
    modeDescription,
    () => displayMeals(getMeals())
);

loadMeals(
    displayMeals,
    refreshSelectedMeal
);