import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getArticle = async () => {
  try {
    // const res = await axios.get(`${process.env.PROD_URL}/getArticle`);
    const res = await axios.get(`https://asia-southeast2-feed-forward-187f4.cloudfunctions.net/app/api/getArticle`);
    const article = res.data;
    if (article.status !== 200) {
      throw new Error(article.status);
    }
    const articleData = article.data;
    return articleData;
  } catch (err) {
    throw new Error(err);
  }
};

export const useArticle = () => {
  return useQuery({ queryKey: ["article"], queryFn: getArticle });
};
