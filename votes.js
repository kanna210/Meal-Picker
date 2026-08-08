import { db } from "./firebase.js";
import { updateDoc, doc }
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

export function showVote(meal, currentUser, goodBtn, noBtn, currentVote) {
    const vote = meal.votes?.[currentUser] || "";

    if (vote === "good") {
        goodBtn.style.display = "block";
        noBtn.style.display = "none";
        goodBtn.textContent = "🟢 Good ✓";
        currentVote.textContent = "Change vote";

    } else if (vote === "no") {
        goodBtn.style.display = "none";
        noBtn.style.display = "block";
        noBtn.textContent = "🔴 No ✓";
        currentVote.textContent = "Change vote";

    } else {
        goodBtn.style.display = "block";
        noBtn.style.display = "block";
        goodBtn.textContent = "🟢 Good";
        noBtn.textContent = "🔴 No";
        currentVote.textContent = "";
    }
}

export function showVoteSummary(meal, voteSummary) {
    const lines = [];

    if (meal.votes?.kanna === "good") {
        lines.push("Kanna: 🟢 Good");
    } else if (meal.votes?.kanna === "no") {
        lines.push("Kanna: 🔴 No");
    }

    if (meal.votes?.dylan === "good") {
        lines.push("Dylan: 🟢 Good");
    } else if (meal.votes?.dylan === "no") {
        lines.push("Dylan: 🔴 No");
    }

    voteSummary.innerHTML = lines.join("<br>");
}

export async function saveVote(meal, user, vote) {
    await updateDoc(doc(db, "meals", meal.id), {
        [`votes.${user}`]: vote
    });
}