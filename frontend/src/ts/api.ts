import { renderEndpoints } from './ui';
import showMessage from './popup';

export async function loadEndpoints() {
    try {
        const endpoints = await window.go.main.App.GetEndpoints();
        renderEndpoints(endpoints);
    } catch {
        showMessage('Não foi possível carregar os endpoints.');
    }
}

export async function addEndpoint(method: string, path: string, response: string, requiresAuth: boolean) {
    await window.go.main.App.AddEndpoint(method, path, response, requiresAuth);
}

export async function removeEndpoint(id: string) {
    await window.go.main.App.RemoveEndpoint(id);
}

export async function startServer(port: string) {
    await window.go.main.App.StartServer(port);
}

export async function stopServer() {
    await window.go.main.App.StopServer();
}
