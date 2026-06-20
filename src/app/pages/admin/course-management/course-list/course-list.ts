import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Course } from '../course.model';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css'],
})
export class CourseList implements OnInit, OnDestroy {
  courses: Course[] = [];
  loading = false;
  error = '';

  constructor(
    private courseService: CourseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadCourses();
  }

  ngOnDestroy(): void {}

  async loadCourses(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.courses = await this.courseService.listCourses();
      this.cdr.markForCheck();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unable to load courses.';
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }

  navigateToCreate(mode: 'ai' | 'manual'): void {
    this.router.navigate(['/admin/courses/new']);
  }

  async onDelete(courseId: string, courseTitle: string): Promise<void> {
    if (!confirm(`Delete "${courseTitle}"?`)) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.courseService.deleteCourse(courseId);
      await this.loadCourses();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Unable to delete course.';
    } finally {
      this.loading = false;
    }
  }
}
