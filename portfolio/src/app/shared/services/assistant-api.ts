import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timeout } from 'rxjs';

/** Maximum question length the backend accepts. */
export const MAX_QUESTION_LENGTH = 500;

/**
 * Client-side limit for a single request.
 *
 * Nginx closes the connection after 65 s. HttpClient has no timeout of its
 * own, so without this the loading state could run forever.
 */
const REQUEST_TIMEOUT_MS = 70_000;

/** One knowledge base section an answer was built from. */
export interface AssistantSource {
  source: string;
  heading: string;
}

/** Reply kinds that carry no payload and are shown with a fixed text of their own. */
export type AssistantFixedTextKind = 'greeting' | 'thanks' | 'farewell' | 'unclear' | 'off_topic';

/** Reply that consists of its kind alone, without any text from the backend. */
export interface AssistantFixedTextReply {
  kind: AssistantFixedTextKind;
}

/** Answer built from the knowledge base. */
export interface AssistantAnswer {
  kind: 'answer';
  answer: string;
  answered: boolean;
  sources: AssistantSource[];
}

export type AssistantResponse = AssistantFixedTextReply | AssistantAnswer;

@Injectable({ providedIn: 'root' })
export class AssistantApi {
  private http = inject(HttpClient);

  private readonly endpoint = '/api/assistant/';

  /**
   * Asks the assistant a single question.
   *
   * @param question - The visitor's question, at most {@link MAX_QUESTION_LENGTH} characters.
   * @param lang     - Language the answer should be written in.
   */
  ask(question: string, lang: string): Observable<AssistantResponse> {
    return this.http
      .post<AssistantResponse>(this.endpoint, { question, lang })
      .pipe(timeout(REQUEST_TIMEOUT_MS));
  }
}
