import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-es6-course',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="course-page">
      <div class="course-card course-detail">
        <h2>ES6 Course</h2>
        <p>Master modern JavaScript with ES6 features like classes, modules, arrow functions, and async workflows.</p>
      </div>
    </section>
  `,
  styles: [
    `.course-page { padding: 16px; }
    .course-detail { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }`
  ]
})
export class Es6Course {}
