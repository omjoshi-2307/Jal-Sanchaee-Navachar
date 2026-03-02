import { db } from "../../../services/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export const getFarmerHistory = async (uid) => {
    try {
        const historyRef = collection(db, "farming_history");
        const q = query(
            historyRef,
            where("farmerId", "==", uid),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching farmer history:", error);
        throw error;
    }
};
