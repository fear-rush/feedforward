import { useQuery } from "@tanstack/react-query";
import { db } from "../utils/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const getArticle = async () => {
  try {
    const article = await getDocs(collection(db, "article"));
    const articleData = article.docs.map((doc) => doc.data());
    return articleData;
  } catch (err) {
    throw err;
  }
};

export const useArticle = () => {
  return useQuery({ queryKey: ["article"], queryFn: getArticle });
};
