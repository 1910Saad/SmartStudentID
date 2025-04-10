import { StudentData } from "./types";

const STORAGE_KEY = "unity_student_cards";

export const saveStudentCard = (studentData: StudentData): void => {
  const savedCards = getSavedCards();
  
  // Create a unique ID and add timestamp
  const newCard: StudentData = {
    ...studentData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  savedCards.push(newCard);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCards));
};

export const getSavedCards = (): StudentData[] => {
  const savedCardsJSON = localStorage.getItem(STORAGE_KEY);
  if (!savedCardsJSON) return [];
  
  try {
    return JSON.parse(savedCardsJSON);
  } catch (error) {
    console.error("Error parsing saved cards from localStorage:", error);
    return [];
  }
};

export const getCardById = (id: string): StudentData | undefined => {
  const savedCards = getSavedCards();
  return savedCards.find(card => card.id === id);
};

export const deleteCardById = (id: string): void => {
  const savedCards = getSavedCards();
  const filteredCards = savedCards.filter(card => card.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredCards));
};
