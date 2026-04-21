import questionsJson from "@/data/questions.json";
import topicsJson from "@/data/topics.json";
import subjectsJson from "@/data/subjects.json";
import type { Question, Subject, Topic } from "./schema";

export function getSubjects(): Subject[] {
  return subjectsJson as Subject[];
}

export function getSubject(id: string): Subject | undefined {
  return getSubjects().find((s) => s.id === id);
}

export function getTopics(): Topic[] {
  return topicsJson as Topic[];
}

export function getTopicsBySubject(subjectId: string): Topic[] {
  return getTopics().filter((t) => t.subjectId === subjectId);
}

export function getTopic(id: string): Topic | undefined {
  return getTopics().find((t) => t.id === id);
}

export function getAllQuestions(): Question[] {
  return questionsJson as Question[];
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return getAllQuestions().filter((q) => q.topicId === topicId);
}

export function countQuestionsByTopic(topicId: string): number {
  return getQuestionsByTopic(topicId).length;
}

export function shuffled<T>(input: T[], seed?: number): T[] {
  const arr = [...input];
  let s = seed ?? Math.floor(Math.random() * 2 ** 31);
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) % 2 ** 31;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
