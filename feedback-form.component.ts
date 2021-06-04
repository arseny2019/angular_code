import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from './feedback.service';
import { FeedbackFacade } from './state/feedback.facade';
import { MetaService } from '../../shared/services/meta.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: [ './feedback-form.component.scss' ]
})
export class FeedbackFormComponent implements OnInit {
  form: FormGroup;
  files: File[];
  state$ = this.facade.state$();

  constructor(
    private feedbackService: FeedbackService,
    private facade: FeedbackFacade,
    private metaService: MetaService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.required
      ]),
      phone: new FormControl(null, [
        Validators.minLength(10),
        Validators.required
      ]),
      email: new FormControl(null, [
        Validators.email,
        Validators.required
      ]),
      address: new FormControl('', [
        Validators.required
      ]),
      text: new FormControl('', [
        Validators.required
      ]),
      privacy: new FormControl(null, [
        Validators.requiredTrue
      ])
    });
    this.facade.submitted$().subscribe(next => {
      if (next) {
        this.form.reset();
        this.facade.resetAttachments();
      }
    });
    this.facade.uploadFiles$().subscribe(files => this.files = files);
    this.metaService.updateTag({ name: 'title', content: 'Обратная связь' });
    this.metaService.updateTag({ name: 'description', content: 'Форма обратной связи' });
  }

  submit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        this.form.get(key).markAsTouched();
      });
    } else {
      this.facade.submit(this.form.value);
    }
  }

  formKeyPress(e): void {
    if (e.key === '8' && !this.form.get('phone').value) {
      e.preventDefault();
    }
  }

  isInvalid(name: string): boolean {
    return this.form.get(name).invalid && this.form.get(name).touched;
  }

  fileChange(files: FileList, event): void {
    if (this.files.length >= 4) {
      return;
    }
    const filesArr = [ ...Array.from(files) ];
    const filesToUpload = this.files.length + filesArr.length <= 4 ? filesArr : filesArr.slice(0, 4 - this.files.length);
    this.facade.uploadFiles(filesToUpload);
    event.target.files = null;
    event.target.value = '';
  }

  showPrivacy(): void {
    this.facade.showPrivacy();
  }

  resetAttachment(): void {
    this.facade.resetAttachments();
  }
}
