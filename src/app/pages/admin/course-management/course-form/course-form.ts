import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChapterRequest,
  CourseCreateRequest,
  CourseLevel,
  CourseUpdateRequest,
  ExampleRequest,
  TopicRequest,
} from '../course.model';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.html',
  styleUrls: ['./course-form.css'],
})
export class CourseForm implements OnInit {
  courseForm!: FormGroup;

  isEditMode = false;
  courseId: string | null = null;
  error = '';
  loading = false;
  isAICreated = false;
  readonly levels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', [Validators.required, Validators.minLength(3)]],
      level: ['Beginner', Validators.required],
      durationMinutes: [30, [Validators.required, Validators.min(1)]],
      published: [false],
      chapters: this.fb.array([this.createChapterGroup()]),
    });
  }

  get chapters(): FormArray {
    return this.courseForm.get('chapters') as FormArray;
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;

    if (this.courseId) {
      this.loadCourse(this.courseId);
    }
  }

  private async loadCourse(id: string): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      const course = await this.courseService.getCourseById(id);
      if (!course) {
        this.error = 'Course not found.';
        return;
      }

      this.courseForm.patchValue({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        durationMinutes: course.durationMinutes,
        published: course.published,
      });
      this.isAICreated = course.isAICreated;

      this.courseForm.setControl(
        'chapters',
        this.fb.array(course.chapters.map((chapter) => this.createChapterGroup(chapter)))
      );
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unable to load the course.';
    } finally {
      this.loading = false;
    }
  }

  createChapterGroup(chapter?: ChapterRequest) {
    return this.fb.group({
      id: [chapter?.id ?? ''],
      title: [chapter?.title ?? '', [Validators.required, Validators.minLength(3)]],
      summary: [chapter?.summary ?? '', [Validators.required, Validators.minLength(10)]],
      topics: this.fb.array(
        (chapter?.topics ?? []).map((topic) => this.createTopicGroup(topic)) || [this.createTopicGroup()]
      ),
    });
  }

  createTopicGroup(topic?: TopicRequest) {
    return this.fb.group({
      id: [topic?.id ?? ''],
      title: [topic?.title ?? '', [Validators.required, Validators.minLength(3)]],
      explanation: [topic?.explanation ?? '', [Validators.required, Validators.minLength(10)]],
      examples: this.fb.array(
        (topic?.examples ?? []).map((example) => this.createExampleGroup(example)) || [this.createExampleGroup()]
      ),
    });
  }

  createExampleGroup(example?: ExampleRequest) {
    return this.fb.group({
      id: [example?.id ?? ''],
      code: [example?.code ?? '', Validators.required],
      description: [example?.description ?? '', [Validators.required, Validators.minLength(10)]],
    });
  }

  getTopics(chapterIndex: number): FormArray {
    return this.chapters.at(chapterIndex).get('topics') as FormArray;
  }

  getExamples(chapterIndex: number, topicIndex: number): FormArray {
    return this.getTopics(chapterIndex).at(topicIndex).get('examples') as FormArray;
  }

  addChapter(): void {
    this.chapters.push(this.createChapterGroup());
  }

  removeChapter(index: number): void {
    this.chapters.removeAt(index);
  }

  addTopic(chapterIndex: number): void {
    this.getTopics(chapterIndex).push(this.createTopicGroup());
  }

  removeTopic(chapterIndex: number, topicIndex: number): void {
    this.getTopics(chapterIndex).removeAt(topicIndex);
  }

  addExample(chapterIndex: number, topicIndex: number): void {
    this.getExamples(chapterIndex, topicIndex).push(this.createExampleGroup());
  }

  removeExample(chapterIndex: number, topicIndex: number, exampleIndex: number): void {
    this.getExamples(chapterIndex, topicIndex).removeAt(exampleIndex);
  }

  async onSubmit(): Promise<void> {
    this.error = '';

    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = {
      ...this.courseForm.value,
      isAICreated: this.isAICreated,
    } as CourseCreateRequest & CourseUpdateRequest;

    try {
      if (this.isEditMode && this.courseId) {
        await this.courseService.updateCourse(this.courseId, payload);
      } else {
        await this.courseService.createCourse(payload);
      }

      await this.router.navigate(['/admin/courses']);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unable to save the course.';
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/courses']);
  }

  onModeChange(mode: 'ai' | 'manual'): void {
    this.isAICreated = mode === 'ai';
  }
}
