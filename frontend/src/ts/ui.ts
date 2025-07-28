import { AlertTriangle, ChevronDown, createIcons, KeyRound, Pause, Play, Trash2, X, Lock } from 'lucide';

const endpointListEl = document.getElementById('endpoint-list');
const statusEl = document.getElementById('server-status');

export function renderEmptyState() {
    if (!endpointListEl) return;

    endpointListEl.innerHTML = `
        <div class="text-center py-8 text-gray-400 bg-gray-800/50 rounded-lg">
            <p>Nenhum endpoint configurado.</p>
            <p class="text-sm mt-2">Use o formulário ao lado para começar.</p>
            <div class="mt-6 text-left text-sm p-4 bg-gray-900 rounded-md max-w-md mx-auto">
                <h4 class="font-semibold text-gray-200 flex items-center">
                    <i data-lucide="key-round" class="w-4 h-4 mr-2 text-amber-400"></i>Dica de Autenticação
                </h4>
                <p class="mt-2">POST /auth/login</p>
                <p class="mt-2">Authorization: Bearer fake-jwt-token</p>
            </div>
        </div>`;
    refreshIcons();
}

export function renderEndpoints(endpoints: any[]) {
    if (!endpointListEl) return;

    endpointListEl.innerHTML = '';
    if (!endpoints || endpoints.length === 0) {
        renderEmptyState();
        return;
    }

    endpoints.forEach((ep) => {
        const authIcon = ep.requiresAuth
            ? `<i data-lucide="lock" class="w-4 h-4 text-amber-400 ml-2 flex-shrink-0"></i>`
            : '';
        const div = document.createElement('div');
        div.className =
            'bg-gray-800 p-4 rounded-lg flex justify-between items-center transition-all hover:bg-gray-700/50';
        div.innerHTML = `
            <div class="flex items-center gap-4 overflow-hidden">
                <span class="method-tag method-${ep.method}">${ep.method}</span>
                <code class="text-white font-semibold truncate">${ep.path}</code>
                ${authIcon}
            </div>
            <button class="btn btn-danger !p-2" onclick="removeEndpoint('${ep.id}')" title="Remover Endpoint">
                <i data-lucide="trash-2" class="w-5 h-5"></i>
            </button>`;
        endpointListEl.appendChild(div);
    });

    refreshIcons();
}

export function updateServerStatus(message: string, url: string, isRunning: boolean) {
    if (!statusEl) return;

    statusEl.innerHTML = isRunning
        ? `${message} <a href="${url}" target="_blank" class="font-bold text-white underline">${url}</a>`
        : message;

    statusEl.classList.toggle('bg-status-running-bg', isRunning);
    statusEl.classList.toggle('text-status-running-text', isRunning);
    statusEl.classList.toggle('bg-status-stopped-bg', !isRunning);
    statusEl.classList.toggle('text-status-stopped-text', !isRunning);
}

export function refreshIcons() {
    createIcons({
        icons: {
            'trash-2': Trash2,
            lock: Lock,
            'key-round': KeyRound,
            play: Play,
            pause: Pause,
            'chevron-down': ChevronDown,
            'alert-triagle': AlertTriangle,
            x: X,
        },
    });
}
