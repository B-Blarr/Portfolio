import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { Form } from './form';

describe('Form', () => {
  let fixture: ComponentFixture<Form>;
  let component: Form;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Form],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideTranslateService(),
      ],
    });
    fixture = TestBed.createComponent(Form);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function fillValidForm(): void {
    component.userform.setValue({
      name: 'Ben',
      email: 'benjamin@example.de',
      message: 'Hello there',
      privacyAccepted: true,
      website: '',
    });
  }

  describe('validation, kept in line with the backend serializer', () => {
    it('requires a name with at least 3 characters', () => {
      const name = component.userform.controls.name;

      name.setValue('');
      expect(name.hasError('required')).toBe(true);
      name.setValue('Be');
      expect(name.hasError('minlength')).toBe(true);
      name.setValue('Ben');
      expect(name.valid).toBe(true);
    });

    it.each([
      'benjamin@example.de',
      'b.blarr+portfolio@mail.example.com',
      '  benjamin@example.de  ',
    ])('accepts %j as email', (email) => {
      component.userform.controls.email.setValue(email);
      expect(component.userform.controls.email.valid).toBe(true);
    });

    it.each([
      'benjamin@example',
      'benjamin@example.d',
      '.benjamin@example.de',
      'benjamin.@example.de',
      'benjamin..blarr@example.de',
      'benjamin@@example.de',
      'ben jamin@example.de',
    ])('rejects %j as email', (email) => {
      component.userform.controls.email.setValue(email);
      expect(component.userform.controls.email.hasError('pattern')).toBe(true);
    });

    it('accepts a message between 10 and 2500 characters', () => {
      const message = component.userform.controls.message;

      message.setValue('a'.repeat(9));
      expect(message.hasError('minlength')).toBe(true);
      message.setValue('a'.repeat(10));
      expect(message.valid).toBe(true);
      message.setValue('a'.repeat(2500));
      expect(message.valid).toBe(true);
      message.setValue('a'.repeat(2501));
      expect(message.hasError('maxlength')).toBe(true);
    });

    it('requires the privacy checkbox to be ticked', () => {
      const privacy = component.userform.controls.privacyAccepted;

      expect(privacy.hasError('required')).toBe(true);
      privacy.setValue(true);
      expect(privacy.valid).toBe(true);
    });
  });

  describe('submit', () => {
    it('sends nothing and shows every error when the form is empty', async () => {
      fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      await fixture.whenStable();

      httpTesting.expectNone('/api/contact/');
      expect(fixture.nativeElement.querySelectorAll('.error-message').length).toBe(4);
    });

    it('posts the form including the empty honeypot to the contact endpoint', () => {
      fillValidForm();
      component.onSubmit();

      const request = httpTesting.expectOne('/api/contact/');
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({
        name: 'Ben',
        email: 'benjamin@example.de',
        message: 'Hello there',
        privacyAccepted: true,
        website: '',
      });
      request.flush({});
    });

    it('shows the success message and resets the form after three seconds', () => {
      vi.useFakeTimers();
      fillValidForm();
      component.onSubmit();
      httpTesting.expectOne('/api/contact/').flush({});

      expect(fixture.nativeElement.querySelector('.success-box')).not.toBeNull();

      vi.advanceTimersByTime(2999);
      expect(component.mailSent).toBe(true);
      vi.advanceTimersByTime(1);
      expect(component.mailSent).toBe(false);
      expect(component.userform.controls.name.value).toBeNull();
    });

    it('shows the error box when the server rejects the message', () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);
      fillValidForm();
      component.onSubmit();
      httpTesting
        .expectOne('/api/contact/')
        .flush(
          { message: ['Ensure this field has at least 10 characters.'] },
          { status: 400, statusText: 'Bad Request' },
        );

      expect(component.mailError).toBe(true);
      expect(component.mailSent).toBe(false);
      expect(fixture.nativeElement.querySelector('.error-box')).not.toBeNull();
    });
  });
});
