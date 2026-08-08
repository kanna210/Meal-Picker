import { db } from "./firebase.js";

import {
    onSnapshot,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

let currentMode = "keep";

export function isCrossedOut(meal) {
    const kanna = meal.votes?.kanna;
    const dylan = meal.votes?.dylan;

    if (currentMode === "eliminate") {
        return kanna === "no" || dylan === "no";
    }

    return kanna === "no" && dylan === "no";
}

export function initializeModes(
    eliminateBtn,
    keepBtn,
    description,
    refresh
) {
    eliminateBtn.onclick = async () => {
        await setDoc(
            doc(db, "settings", "app"),
            { mode: "eliminate" },
            { merge: true }
        );
    };

    keepBtn.onclick = async () => {
        await setDoc(
            doc(db, "settings", "app"),
            { mode: "keep" },
            { merge: true }
        );
    };

    onSnapshot(doc(db, "settings", "app"), async snapshot => {
        if (!snapshot.exists()) {
            await setDoc(doc(db, "settings", "app"), {
                mode: "keep"
            });
            return;
        }

        currentMode = snapshot.data().mode || "keep";

        eliminateBtn.classList.toggle(
            "active",
            currentMode === "eliminate"
        );

        keepBtn.classList.toggle(
            "active",
            currentMode === "keep"
        );

        description.textContent =
            currentMode === "eliminate"
                ? "Cross out when either person chooses No."
                : "Cross out only when both people choose No.";

        refresh();
    });
}