import { db } from "./firebase";
import { collection, addDoc, doc, updateDoc, increment, getDoc, setDoc, onSnapshot } from "firebase/firestore";

export const saveWaterUsage = async (data) => {
    try {
        await addDoc(collection(db, "waterUsage"), data);
    } catch (error) {
        console.error(error);
    }
};

export const updateUserCredits = async (farmerId, earnedCredits) => {
    try {
        const userRef = doc(db, "users", farmerId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            await setDoc(userRef, {
                credits_balance: earnedCredits,
                name: farmerId
            });
            console.log("User created with initial credits");
        } else {
            // Update existing user document
            await updateDoc(userRef, {
                credits_balance: increment(earnedCredits)
            });
            console.log("User credits updated");
        }
    } catch (error) {
        console.error("Error updating user credits:", error);
    }
};

export const getUserData = async (farmerId) => {
    try {
        const userRef = doc(db, "users", farmerId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            console.log("User not found");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

export const subscribeToUserCredits = (farmerId, callback) => {
    try {
        const userRef = doc(db, "users", farmerId);
        return onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                callback(doc.data());
            } else {
                console.log("No such document!");
            }
        });
    } catch (error) {
        console.error("Error subscribing to user credits:", error);
    }
};
