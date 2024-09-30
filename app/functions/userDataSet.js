import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from '../../firebaseConfig';
import userData from '../data/userData';

export default async function userDataSet(uid, setUserData) {
   try {
      const q = query(collection(firestore, "Users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         const data = doc.data();
         const id = doc.id;
         userData.storeData({ id, ...data });
         setUserData({ id, ...data });
         console.log("User data has been set (userDataSet.js)");
      });
   } catch (error) {
      console.error("Error getting documents (userDataSet.js): ", error);
   }
}