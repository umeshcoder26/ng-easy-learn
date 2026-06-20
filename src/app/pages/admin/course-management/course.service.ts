import { Injectable } from '@angular/core';
import {
  ChapterRequest,
  Course,
  CourseCreateRequest,
  CourseUpdateRequest,
  ExampleRequest,
  TopicRequest,
} from './course.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private courses: Course[] = [
    {
      id: 'c1',
      title: 'Angular Fundamentals',
      description: 'Learn the core Angular concepts and build reusable UI with standalone components.',
      category: 'Frontend',
      level: 'Beginner',
      durationMinutes: 80,
      published: true,
      isAICreated: false,
      updatedAt: '2026-06-01T10:15:00Z',
      chapters: [
        {
          id: 'ch1',
          title: 'Component Basics',
          summary: 'Understand how standalone components, templates, and property binding work.',
          topics: [
            {
              id: 't1',
              title: 'Standalone Component',
              explanation: 'A component in Angular is a self-contained UI block with its own template and styles.',
              examples: [
                {
                  id: 'e1',
                  code: '<app-tutorial></app-tutorial>',
                  description: 'Use a component selector in another template.',
                },
              ],
            },
            {
              id: 't2',
              title: 'Property Binding',
              explanation: 'Pass data from a parent template into a child component or DOM property.',
              examples: [
                {
                  id: 'e2',
                  code: '<img [src]="imageUrl" alt="Preview" />',
                  description: 'Bind an image source property in a template.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'c2',
      title: 'Modern JavaScript',
      description: 'Master ES6+ features and modern JavaScript patterns for web development.',
      category: 'Web',
      level: 'Intermediate',
      durationMinutes: 55,
      published: true,
      isAICreated: true,
      updatedAt: '2026-05-22T09:30:00Z',
      chapters: [
        {
          id: 'ch2',
          title: 'ES6 Syntax',
          summary: 'Learn arrow functions, destructuring, and template strings.',
          topics: [
            {
              id: 't3',
              title: 'Arrow Functions',
              explanation: 'A shorter syntax for writing functions with lexical `this`.',
              examples: [
                {
                  id: 'e3',
                  code: 'const sum = (a, b) => a + b;',
                  description: 'A simple arrow function that returns a value.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'c3',
      title: 'Python for Automation',
      description: 'Automate everyday tasks and explore data manipulation using Python.',
      category: 'Backend',
      level: 'Beginner',
      durationMinutes: 70,
      published: false,
      isAICreated: false,
      updatedAt: '2026-06-08T14:05:00Z',
      chapters: [
        {
          id: 'ch3',
          title: 'Script Basics',
          summary: 'Create reusable scripts with functions and file I/O.',
          topics: [
            {
              id: 't4',
              title: 'Reading Files',
              explanation: 'Open a file and process each line in Python.',
              examples: [
                {
                  id: 'e4',
                  code: 'with open("data.txt") as file:\n    for line in file:\n      print(line.strip())',
                  description: 'Read and print each line from a text file.',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  private nextId = 4;

  async listCourses(): Promise<Course[]> {
    try {
      return this.courses.map((course) => this.cloneCourse(course));
    } catch (error) {
      throw new Error('Unable to load course catalog.');
    }
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    try {
      const course = this.courses.find((item) => item.id === id);
      return course ? this.cloneCourse(course) : undefined;
    } catch (error) {
      throw new Error('Unable to load the course details.');
    }
  }

  async createCourse(input: CourseCreateRequest): Promise<Course> {
    try {
      const newCourse = this.buildCourse(input);
      this.courses.unshift(newCourse);
      return this.cloneCourse(newCourse);
    } catch (error) {
      throw new Error('Unable to create the course.');
    }
  }

  async updateCourse(id: string, input: CourseUpdateRequest): Promise<Course> {
    try {
      const index = this.courses.findIndex((course) => course.id === id);
      if (index === -1) {
        throw new Error('Course not found.');
      }
      const updatedCourse = this.buildCourse(input, id);
      this.courses[index] = { ...this.courses[index], ...updatedCourse };
      this.courses[index].updatedAt = new Date().toISOString();
      return this.cloneCourse(this.courses[index]);
    } catch (error) {
      throw new Error('Unable to update the course.');
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      const originalLength = this.courses.length;
      this.courses = this.courses.filter((course) => course.id !== id);
      if (this.courses.length === originalLength) {
        throw new Error('Course not found.');
      }
    } catch (error) {
      throw new Error('Unable to delete the course.');
    }
  }

  private buildCourse(input: CourseCreateRequest | CourseUpdateRequest, existingId?: string): Course {
    const courseId = existingId ?? `c${this.nextId++}`;
    return {
      id: courseId,
      title: input.title,
      description: input.description,
      category: input.category,
      level: input.level,
      durationMinutes: input.durationMinutes,
      published: input.published,
      isAICreated: input.isAICreated ?? false,
      updatedAt: new Date().toISOString(),
      chapters: input.chapters.map((chapter) => this.buildChapter(chapter)),
    };
  }

  private buildChapter(input: ChapterRequest) {
    return {
      id: input.id ?? this.createId('ch'),
      title: input.title,
      summary: input.summary,
      topics: input.topics.map((topic) => this.buildTopic(topic)),
    };
  }

  private buildTopic(input: TopicRequest) {
    return {
      id: input.id ?? this.createId('t'),
      title: input.title,
      explanation: input.explanation,
      examples: input.examples.map((example) => this.buildExample(example)),
    };
  }

  private buildExample(input: ExampleRequest) {
    return {
      id: input.id ?? this.createId('e'),
      code: input.code,
      description: input.description,
    };
  }

  private cloneCourse(course: Course): Course {
    return {
      ...course,
      chapters: course.chapters.map((chapter) => ({
        ...chapter,
        topics: chapter.topics.map((topic) => ({
          ...topic,
          examples: topic.examples.map((example) => ({ ...example })),
        })),
      })),
    };
  }

  private createId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now()}`;
  }
}
