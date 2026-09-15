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

  it('leaves the tab order when it sits inside a link', async () => {
    fixture.componentRef.setInput('tabbable', false);
    await fixture.whenStable();

    expect(button.getAttribute('tabindex')).toBe('-1');
  });

  it('can be the submit button of a form', async () => {
    fixture.componentRef.setInput('type', 'submit');
    await fixture.whenStable();

    expect(button.type).toBe('submit');
  });
});
