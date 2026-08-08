import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    doc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let meals = [];
let selectedMeal = null;

export function getMeals() {
    return meals;
}

export function getSelectedMeal() {
    return selectedMeal;
}

export function setSelectedMeal(meal) {
    selectedMeal = meal;
}

export function loadMeals(displayMeals, refreshSelectedMeal) {
    onSnapshot(collection(db, "meals"), async snapshot => {
        const updatedMeals = [];

        for (const docSnapshot of snapshot.docs) {
            const meal = {
                id: docSnapshot.id,
                ...docSnapshot.data()
            };

            if (!meal.votes) {
                meal.votes = {
                    kanna: "",
                    dylan: ""
                };

                await updateDoc(doc(db, "meals", meal.id), {
                    votes: meal.votes
                });
            }

            updatedMeals.push(meal);
        }

        meals = updatedMeals;

        displayMeals(meals);
        refreshSelectedMeal();
    });
}

export async function addMeal(name, description, image) {
    await addDoc(collection(db, "meals"), {
        name,
        description,
        image,
        votes: {
            kanna: "",
            dylan: ""
        }
    });
}

export async function deleteMeal(meal) {
    await deleteDoc(doc(db, "meals", meal.id));
}

export async function resetVotes() {
    await Promise.all(
        meals.map(meal =>
            updateDoc(doc(db, "meals", meal.id), {
                votes: {
                    kanna: "",
                    dylan: ""
                }
            })
        )
    );
}