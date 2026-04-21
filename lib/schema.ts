import { z } from "zod";

export const SubjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
});

export const TopicSchema = z.object({
  id: z.string().min(1),
  subjectId: z.string().min(1),
  name: z.string().min(1),
  source: z.string().min(1),
  description: z.string().min(1),
});

const OptionSchema = z.object({
  id: z.enum(["a", "b", "c", "d", "e"]),
  text: z.string().min(1),
  isCorrect: z.boolean(),
  explanation: z.string().min(1),
});

export const ObjectiveQuestionSchema = z
  .object({
    id: z.string().min(1),
    topicId: z.string().min(1),
    type: z.literal("objective"),
    difficulty: z.enum(["easy", "medium", "hard"]),
    prompt: z.string().min(1),
    options: z.array(OptionSchema).min(2).max(5),
    reference: z.string().optional(),
  })
  .refine((q) => q.options.filter((o) => o.isCorrect).length === 1, {
    message: "Objective question must have exactly one correct option",
  })
  .refine((q) => new Set(q.options.map((o) => o.id)).size === q.options.length, {
    message: "Option ids must be unique",
  });

export const OpenQuestionSchema = z.object({
  id: z.string().min(1),
  topicId: z.string().min(1),
  type: z.literal("open"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  prompt: z.string().min(1),
  modelAnswer: z.string().min(1),
  keyPoints: z.array(z.string().min(1)).min(2).max(10),
  reference: z.string().optional(),
});

export const QuestionSchema = z.discriminatedUnion("type", [
  ObjectiveQuestionSchema.innerType().innerType(),
  OpenQuestionSchema,
]);

export const BasicFlashcardSchema = z.object({
  id: z.string().min(1),
  topicId: z.string().min(1),
  type: z.literal("basic").optional(),
  front: z.string().min(1),
  back: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export const ClozeFlashcardSchema = z.object({
  id: z.string().min(1),
  topicId: z.string().min(1),
  type: z.literal("cloze"),
  text: z.string().min(1).refine((s) => /\{\{c\d+::[^}]+\}\}/.test(s), {
    message: "Cloze text must contain at least one {{c1::...}} marker",
  }),
  extra: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const FlashcardSchema = z.union([BasicFlashcardSchema, ClozeFlashcardSchema]);

export const SubjectsFileSchema = z.array(SubjectSchema);
export const TopicsFileSchema = z.array(TopicSchema);
export const QuestionsFileSchema = z.array(
  z.union([ObjectiveQuestionSchema, OpenQuestionSchema])
);
export const FlashcardsFileSchema = z.array(FlashcardSchema);

export type Subject = z.infer<typeof SubjectSchema>;
export type Topic = z.infer<typeof TopicSchema>;
export type ObjectiveQuestion = z.infer<typeof ObjectiveQuestionSchema>;
export type OpenQuestion = z.infer<typeof OpenQuestionSchema>;
export type Question = ObjectiveQuestion | OpenQuestion;
export type BasicFlashcard = z.infer<typeof BasicFlashcardSchema>;
export type ClozeFlashcard = z.infer<typeof ClozeFlashcardSchema>;
export type Flashcard = BasicFlashcard | ClozeFlashcard;
export type Difficulty = "easy" | "medium" | "hard";
export type Result = "correct" | "partial" | "wrong";
