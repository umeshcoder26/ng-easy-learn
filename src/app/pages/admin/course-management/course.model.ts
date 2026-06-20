export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  durationMinutes: number;
  published: boolean;
  isAICreated: boolean;
  updatedAt: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  summary: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  explanation: string;
  examples: Example[];
}

export interface Example {
  id: string;
  code: string;
  description: string;
}

export interface CourseCreateRequest {
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  durationMinutes: number;
  published: boolean;
  isAICreated?: boolean;
  chapters: ChapterRequest[];
}

export interface CourseUpdateRequest {
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  durationMinutes: number;
  published: boolean;
  isAICreated?: boolean;
  chapters: ChapterRequest[];
}

export interface ChapterRequest {
  id?: string;
  title: string;
  summary: string;
  topics: TopicRequest[];
}

export interface TopicRequest {
  id?: string;
  title: string;
  explanation: string;
  examples: ExampleRequest[];
}

export interface ExampleRequest {
  id?: string;
  code: string;
  description: string;
}
