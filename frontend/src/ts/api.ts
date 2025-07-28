import { renderEndpoints } from './ui';

export async function loadEndpoints() {
    const endpoints = await window.go.backend.App.GetEndpoints();

    renderEndpoints(endpoints);
}

export async function addEndpoint(method: string, path: string, response: string, requiresAuth: boolean) {
    await window.go.backend.App.AddEndpoint(method, path, response, requiresAuth);
}

export async function removeEndpoint(id: string) {
    await window.go.backend.App.RemoveEndpoint(id);
}

export async function startServer(port: string) {
    await window.go.backend.App.StartServer(port);
}

export async function stopServer() {
    await window.go.backend.App.StopServer();
}
