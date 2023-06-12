import {
    Subjects,
    Publisher,
    ExpirationCompleteEvent,
} from '@omticketorg/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
