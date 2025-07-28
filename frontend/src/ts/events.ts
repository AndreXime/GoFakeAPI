import { updateServerStatus } from './ui';
import showMessage from './popup';

export function initEvents() {
    window.runtime.EventsOn('server-status', updateServerStatus);
    window.runtime.EventsOn('server-error', (errMsg: string) => showMessage(errMsg));
}
