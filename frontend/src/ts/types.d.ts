// Define a estrutura de um endpoint, correspondendo ao struct do Go.
export interface Endpoint {
    id: string;
    method: string;
    path: string;
    response: string;
    requiresAuth: boolean;
}

// Estende a interface global Window para incluir as funções do Wails.
declare global {
    interface Window {
        // Funções expostas do backend Go
        go: {
            backend: {
                App: {
                    GetEndpoints(): Promise<Endpoint[]>;
                    AddEndpoint(
                        method: string,
                        path: string,
                        response: string,
                        requiresAuth: boolean
                    ): Promise<Endpoint>;
                    RemoveEndpoint(id: string): Promise<void>;
                    StartServer(port: string): Promise<void>;
                    StopServer(): Promise<void>;
                };
            };
        };
        // Funções do runtime do Wails para eventos
        runtime: {
            WindowMaximise(): unknown;
            WindowShow(): unknown;
            EventsOn(eventName: string, callback: (...data: any[]) => void): void;
            EventsEmit(eventName: string, ...data: any[]): void;
        };
        // Função global para remover endpoints, definida em handlers.ts
        removeEndpoint(id: string): void;
    }
}
