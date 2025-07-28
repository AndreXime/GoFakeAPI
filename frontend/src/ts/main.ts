import { loadEndpoints } from './api';
import { updateServerStatus } from './ui';
import { initHandlers } from './handlers';
import { initEvents } from './events';
import showMessage from './popup';

async function initialize() {
    await loadEndpoints();
    updateServerStatus('Servidor parado', '', false);
    initHandlers();
    initEvents();
}

try {
    await initialize();
} catch (error) {
    showMessage(error);
}
