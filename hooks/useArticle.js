import { useQuery } from "@tanstack/react-query";

const getArticle = async () => {
  try {
    const res = await fetch(
      `${process.env.DEV_URL}/getArticle`
    );
    const article = await res.json();
    const articleData = article.data;
    return articleData;
  } catch (err) {
    throw new Error(err);
  }
};

export const useArticle = () => {
  return useQuery({ queryKey: ["article"], queryFn: getArticle });
};
