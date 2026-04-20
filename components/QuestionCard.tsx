"use client";
import type { Question, Result } from "@/lib/schema";
import { ObjectiveQuestion } from "./ObjectiveQuestion";
import { OpenQuestion } from "./OpenQuestion";

type Props = {
  question: Question;
  onNext: (result: Result) => void;
  questionNumber: number;
  totalQuestions: number;
};

export function QuestionCard({ question, onNext, questionNumber, totalQuestions }: Props) {
  if (question.type === "objective") {
    return (
      <ObjectiveQuestion
        question={question}
        onNext={onNext}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
      />
    );
  }
  return (
    <OpenQuestion
      question={question}
      onNext={onNext}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
    />
  );
}
