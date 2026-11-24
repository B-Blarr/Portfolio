import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnimatedButton } from './animated-button';

describe('AnimatedButton', () => {
  let fixture: ComponentFixture<AnimatedButton>;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [AnimatedButton] });
    fixture = TestBed.createComponent(AnimatedButton);
    await fixture.whenStable();
    button = fixture.nativeElement.querySelector('button');
  });

  it('renders a plain button that can be reached with Tab', () => {
    expect(button.type).toBe('button');
    expect(button.hasAttribute('tabindex')).toBe(false);
  });

  it('renders a span instead of a button when it sits inside a link', async () => {
    fixture.componentRef.setInput('insideLink', true);
    await fixture.whenStable();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('button')).toBeNull();
    expect(host.querySelector('span.animated-button .button-text')).not.toBeNull();
  });

  it('can be the submit button of a form', async () => {
    fixture.componentRef.setInput('type', 'submit');
    await fixture.whenStable();

    expect(button.type).toBe('submit');
  });
});
