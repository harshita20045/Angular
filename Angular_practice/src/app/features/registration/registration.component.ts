import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
  FormArray, 
  Validators, 
  ReactiveFormsModule, 
  AbstractControl, 
  ValidationErrors, 
  AsyncValidatorFn 
} from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { UserRole } from '../../core/models';

// Custom synchronous validator for matching passwords
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;
  if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    confirmPassword.setErrors(null);
    return null;
  }
}

// Custom asynchronous validator for checking email availability in LDAP/db
export function emailAvailableValidator(userService: UserService): AsyncValidatorFn {
  return async (control: AbstractControl): Promise<ValidationErrors | null> => {
    if (!control.value || control.value.length < 5) {
      return null;
    }
    const isAvailable = await userService.checkEmailAvailable(control.value);
    return isAvailable ? null : { emailTaken: true };
  };
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="registration-container">
      <header class="page-header">
        <div>
          <h1 class="page-title">Member Onboarding &amp; Account Provisioning</h1>
          <p class="page-subtitle">Register enterprise personnel, assign security clearance roles, and configure initial competencies.</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-secondary" (click)="fillSampleData()">
            ⚡ Pre-fill Sample Profile (patchValue)
          </button>
        </div>
      </header>

      @if (submissionSuccess()) {
        <div class="success-banner">
          <div class="banner-icon">✓</div>
          <div>
            <h3>Enterprise Account Successfully Provisioned!</h3>
            <p>Credentials and security onboarding keys have been dispatched to <strong>{{ registeredEmail() }}</strong>.</p>
          </div>
          <a routerLink="/users" class="btn btn-sm btn-primary">View in Team Directory</a>
        </div>
      }

      <div class="form-card">
        <form [formGroup]="onboardForm" (ngSubmit)="onSubmit()">
          <!-- Section 1: Basic Information -->
          <div class="form-section">
            <h2 class="section-title">1. Personnel Identity</h2>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="name">
                  Full Name <span class="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  class="form-input"
                  formControlName="name"
                  placeholder="e.g. Maya Lin"
                  [class.is-invalid]="isFieldInvalid('name')"
                />
                @if (isFieldInvalid('name')) {
                  <div class="field-error">
                    @if (onboardForm.get('name')?.hasError('required')) {
                      Full legal name is required.
                    }
                    @if (onboardForm.get('name')?.hasError('minlength')) {
                      Name must contain at least 3 characters.
                    }
                  </div>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="email">
                  Corporate Email <span class="required">*</span>
                  @if (onboardForm.get('email')?.pending) {
                    <span class="pending-spinner">Verifying directory availability...</span>
                  }
                </label>
                <input
                  id="email"
                  type="email"
                  class="form-input"
                  formControlName="email"
                  placeholder="e.g. m.lin@pulse-enterprise.com"
                  [class.is-invalid]="isFieldInvalid('email')"
                />
                @if (isFieldInvalid('email')) {
                  <div class="field-error">
                    @if (onboardForm.get('email')?.hasError('required')) {
                      Corporate email address is required.
                    }
                    @if (onboardForm.get('email')?.hasError('email')) {
                      Please provide a valid email format.
                    }
                    @if (onboardForm.get('email')?.hasError('emailTaken')) {
                      This email is already registered in the directory.
                    }
                  </div>
                }
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="department">
                  Department / Unit <span class="required">*</span>
                </label>
                <input
                  id="department"
                  type="text"
                  class="form-input"
                  formControlName="department"
                  placeholder="e.g. Platform Engineering"
                  [class.is-invalid]="isFieldInvalid('department')"
                />
                @if (isFieldInvalid('department')) {
                  <div class="field-error">Department designation is required.</div>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="role">
                  Security Role Clearance <span class="required">*</span>
                </label>
                <select id="role" class="form-select" formControlName="role">
                  <option value="Engineer">Engineer</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Security Credentials -->
          <div class="form-section">
            <h2 class="section-title">2. Initial Security Credentials</h2>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="password">
                  Initial Password <span class="required">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  class="form-input"
                  formControlName="password"
                  placeholder="Minimum 8 characters"
                  [class.is-invalid]="isFieldInvalid('password')"
                />
                @if (isFieldInvalid('password')) {
                  <div class="field-error">
                    @if (onboardForm.get('password')?.hasError('required')) {
                      Password is required.
                    }
                    @if (onboardForm.get('password')?.hasError('minlength')) {
                      Password must be at least 8 characters long.
                    }
                  </div>
                }
              </div>

              <div class="form-group">
                <label class="form-label" for="confirmPassword">
                  Confirm Password <span class="required">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  class="form-input"
                  formControlName="confirmPassword"
                  placeholder="Repeat initial password"
                  [class.is-invalid]="isFieldInvalid('confirmPassword')"
                />
                @if (isFieldInvalid('confirmPassword')) {
                  <div class="field-error">
                    @if (onboardForm.get('confirmPassword')?.hasError('required')) {
                      Password confirmation is required.
                    }
                    @if (onboardForm.get('confirmPassword')?.hasError('passwordMismatch')) {
                      Passwords do not match.
                    }
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Section 3: Dynamic Skills (FormArray) -->
          <div class="form-section">
            <div class="section-header-inline">
              <h2 class="section-title" style="margin: 0">3. Technical Competencies &amp; Skills (FormArray)</h2>
              <button type="button" class="btn btn-sm btn-secondary" (click)="addSkillField()">
                + Add Competency
              </button>
            </div>
            <p class="section-subtext">Add verified technical specialties to populate member routing profiles.</p>

            <div formArrayName="skills" class="skills-array">
              @for (skillCtrl of skillsArray.controls; track $index) {
                <div class="skill-input-row">
                  <input
                    type="text"
                    class="form-input"
                    [formControlName]="$index"
                    placeholder="e.g. Distributed Systems, Kubernetes, TypeScript"
                  />
                  @if (skillsArray.length > 1) {
                    <button
                      type="button"
                      class="btn btn-sm btn-danger remove-skill-btn"
                      title="Remove skill"
                      (click)="removeSkillField($index)">
                      ✕
                    </button>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="resetForm()">
              Reset Form
            </button>

            <button
              type="submit"
              class="btn btn-primary submit-btn"
              [disabled]="onboardForm.invalid || onboardForm.pending || isSubmitting()">
              {{ isSubmitting() ? 'Provisioning Account...' : 'Complete Onboarding' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .registration-container {
      max-width: 900px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .page-subtitle {
      font-size: 0.92rem;
      color: #94a3b8;
      margin-top: 0.2rem;
    }

    .success-banner {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 2rem;
      color: #d1fae5;
    }
    .banner-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #10b981;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 800;
      flex-shrink: 0;
    }
    .success-banner h3 { margin: 0; color: #f8fafc; font-size: 1.1rem; }
    .success-banner p { margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #a7f3d0; }

    .form-card {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 1.75rem;
      border-bottom: 1px solid #1f2937;
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 1.25rem;
    }
    .section-header-inline {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }
    .section-subtext {
      font-size: 0.82rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    @media (max-width: 640px) {
      .form-row { grid-template-columns: 1fr; }
    }

    .required { color: #f43f5e; }
    .pending-spinner {
      font-size: 0.72rem;
      color: #38bdf8;
      margin-left: 0.5rem;
      font-weight: 400;
    }

    .form-input.is-invalid {
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.05);
    }
    .field-error {
      font-size: 0.75rem;
      color: #f87171;
      margin-top: 0.35rem;
    }

    .skills-array {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .skill-input-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .remove-skill-btn {
      padding: 0.5rem 0.75rem;
    }

    .form-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
    }
    .submit-btn {
      min-width: 180px;
    }
  `]
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);

  isSubmitting = signal<boolean>(false);
  submissionSuccess = signal<boolean>(false);
  registeredEmail = signal<string>('');

  // Typed Reactive Form with Custom & Async Validators
  onboardForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: [
        '',
        [Validators.required, Validators.email],
        [emailAvailableValidator(this.userService)]
      ],
      department: ['', Validators.required],
      role: ['Engineer' as UserRole, Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      skills: this.fb.array([
        this.fb.control('Angular 19'),
        this.fb.control('TypeScript Architecture')
      ])
    },
    {
      validators: [passwordMatchValidator]
    }
  );

  get skillsArray(): FormArray {
    return this.onboardForm.get('skills') as FormArray;
  }

  addSkillField(): void {
    this.skillsArray.push(this.fb.control(''));
  }

  removeSkillField(index: number): void {
    if (this.skillsArray.length > 1) {
      this.skillsArray.removeAt(index);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.onboardForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Demonstration of patchValue() vs setValue()
  fillSampleData(): void {
    this.onboardForm.patchValue({
      name: 'Dr. Soraya Hansen',
      email: 's.hansen@pulse-enterprise.com',
      department: 'Distributed Systems & AI',
      role: 'Manager',
      password: 'SecurePassword2026!',
      confirmPassword: 'SecurePassword2026!'
    });
  }

  resetForm(): void {
    this.onboardForm.reset({
      role: 'Engineer'
    });
    this.submissionSuccess.set(false);
  }

  async onSubmit(): Promise<void> {
    if (this.onboardForm.invalid || this.onboardForm.pending) {
      this.onboardForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.onboardForm.value;

    const created = await this.userService.create({
      name: formVal.name,
      email: formVal.email,
      role: formVal.role,
      status: 'Active',
      department: formVal.department,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      joinedDate: new Date().toISOString().split('T')[0],
      skills: formVal.skills.filter((s: string) => s && s.trim()),
      metrics: {
        projectsCompleted: 1,
        rating: 5.0,
        openTickets: 0
      }
    });

    this.isSubmitting.set(false);
    this.registeredEmail.set(created.email);
    this.submissionSuccess.set(true);
  }
}
