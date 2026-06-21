import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Course } from '../admin/course-management/course.model';
import { CourseService } from '../admin/course-management/course.service';

@Component({
  selector: 'app-angular-course',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './angular-course.html',
  styleUrls: ['./angular-course.css'],
})
export class AngularCourse implements OnInit {
  course: Course | null = null;
  loading = true;
  error = '';
  expandedChapter: string | null = null;

  constructor(private courseService: CourseService) {}

  async ngOnInit(): Promise<void> {
    await this.loadCourse();
  }

  async loadCourse(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      const course = await this.courseService.getCourseById('angular');
      if (course) {
        this.course = course;
      } else {
        this.error = 'Course not found';
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load course';
    } finally {
      this.loading = false;
    }
  }

  toggleChapter(chapterId: string): void {
    this.expandedChapter = this.expandedChapter === chapterId ? null : chapterId;
  }
}
