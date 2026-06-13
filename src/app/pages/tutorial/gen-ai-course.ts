import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gen-ai-course',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="course-page">
      <div class="course-card course-detail">
        <h2>Gen AI Course</h2>
        <p>Explore generative AI concepts, prompt engineering, and practical use cases for creative applications.</p>
      </div>
    </section>
  `,
  styles: [
    `.course-page { padding: 16px; }
    .course-detail { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }`
  ]
})
export class GenAiCourse {}
