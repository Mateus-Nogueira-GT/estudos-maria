import flashcardsJson from "@/data/flashcards.json";
import type { Flashcard } from "./schema";

export function getAllFlashcards(): Flashcard[] {
  return flashcardsJson as Flashcard[];
}

export function getFlashcardsByTopic(topicId: string): Flashcard[] {
  return getAllFlashcards().filter((f) => f.topicId === topicId);
}

export function countFlashcardsByTopic(topicId: string): number {
  return getFlashcardsByTopic(topicId).length;
}
