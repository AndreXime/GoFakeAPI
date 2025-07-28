import { loadEndpoints } from './api';
import { refreshIcons, updateServerStatus } from './ui';
import { initHandlers } from './handlers';
import { initEvents } from './events';

function initialize() {
    refreshIcons();
    loadEndpoints();
    updateServerStatus('Servidor parado', '', false);
    initHandlers();
    initEvents();
}

if (window.go) {
    initialize();
} else {
    window.runtime.EventsOn('wails:ready', initialize);
}
