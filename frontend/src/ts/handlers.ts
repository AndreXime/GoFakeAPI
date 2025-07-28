import { loadEndpoints, addEndpoint, removeEndpoint, startServer, stopServer } from './api';
import showMessage from './popup';

const form = document.getElementById('add-endpoint-form') as HTMLFormElement;
const methodEl = document.getElementById('method') as HTMLSelectElement;
const pathEl = document.getElementById('path') as HTMLInputElement;
const responseEl = document.getElementById('response') as HTMLTextAreaElement;
const requiresAuthEl = document.getElementById('requires-auth') as HTMLInputElement;
const portEl = document.getElementById('port') as HTMLInputElement;
const startBtn = document.getElementById('start-server');
const stopBtn = document.getElementById('stop-server');

export function initHandlers() {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const path = pathEl.value.startsWith('/') ? pathEl.value : '/' + pathEl.value;
        try {
            JSON.parse(responseEl.value);
            await addEndpoint(methodEl.value, path, responseEl.value, requiresAuthEl.checked);
            form.reset();
            loadEndpoints();
        } catch (err) {
            const msg = err.toString().includes('JSON') ? 'O formato da resposta JSON é inválido.' : `Erro: ${err}`;
            showMessage(msg);
        }
    });

    startBtn?.addEventListener('click', async () => {
        if (!portEl.value) return showMessage('Por favor, insira uma porta.');
        try {
            await startServer(portEl.value);
        } catch (err) {
            showMessage(`Erro ao iniciar o servidor: ${err}`);
        }
    });

    stopBtn?.addEventListener('click', async () => {
        try {
            await stopServer();
        } catch (err) {
            showMessage(`Erro ao parar o servidor: ${err}`);
        }
    });

    // tornar global para uso do botão de remover
    window.removeEndpoint = async (id: string) => {
        try {
            await removeEndpoint(id);
            loadEndpoints();
        } catch (err) {
            showMessage(`Erro ao remover endpoint: ${err}`);
        }
    };
}
