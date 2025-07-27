import { createIcons, icons } from 'lucide';

// --- Seletores de Elementos ---
const form = document.getElementById('add-endpoint-form');
const methodEl = document.getElementById('method');
const pathEl = document.getElementById('path');
const responseEl = document.getElementById('response');
const endpointListEl = document.getElementById('endpoint-list');
const portEl = document.getElementById('port');
const startBtn = document.getElementById('start-server');
const stopBtn = document.getElementById('stop-server');
const statusEl = document.getElementById('server-status');
const toastContainer = document.getElementById('toast-container');

// --- Lógica de Notificações "Toast" ---
const showToast = (message) => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast bg-gray-800 rounded-xl shadow-2xl p-4 w-full border border-red-500/50 flex items-start';

    toast.innerHTML = `
            <div class="flex-shrink-0 pt-0.5">
                <i data-lucide="alert-triangle" class="w-6 h-6 text-red-400"></i>
            </div>
            <div class="ml-3 flex-1">
                <p class="font-semibold text-red-400">Ocorreu um Erro</p>
                <p class="mt-1 text-gray-300">${message}</p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
                <button class="close-toast-btn inline-flex text-gray-400 hover:text-white transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
        `;

    toastContainer.appendChild(toast);
    createIcons({ icons, nodes: [toast] });

    const closeButton = toast.querySelector('.close-toast-btn');

    const removeToast = () => {
        toast.classList.add('closing');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    };

    closeButton.addEventListener('click', removeToast);
    setTimeout(removeToast, 10000); // Remove o toast após 10 segundos
};

// --- Lógica de Endpoints ---
const renderEndpoints = (endpoints) => {
    endpointListEl.innerHTML = '';
    if (!endpoints || endpoints.length === 0) {
        endpointListEl.innerHTML = `
                <div class="text-center py-10 text-gray-400">
                    <p>Nenhum endpoint configurado.</p>
                    <p class="text-sm">Use o formulário ao lado para começar.</p>
                </div>`;
        return;
    }
    endpoints.forEach((ep) => {
        const div = document.createElement('div');
        div.className =
            'bg-gray-800 p-4 rounded-lg flex justify-between items-center transition-all hover:bg-gray-700/50';
        div.innerHTML = `
                <div class="flex items-center gap-4 overflow-hidden">
                    <span class="method-tag method-${ep.method}">${ep.method}</span>
                    <code class="text-white font-semibold truncate">${ep.path}</code>
                </div>
                <button class="btn btn-danger !p-2" onclick="removeEndpoint('${ep.id}')" title="Remover Endpoint">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            `;
        endpointListEl.appendChild(div);
    });
    createIcons({ icons });
};

const loadEndpoints = async () => {
    try {
        const endpoints = await window.go.main.App.GetEndpoints();
        renderEndpoints(endpoints);
    } catch (e) {
        console.error('Erro ao carregar endpoints:', e);
        showToast('Não foi possível carregar os endpoints. Verifique o console para mais detalhes.');
    }
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pathValue = pathEl.value.startsWith('/') ? pathEl.value : '/' + pathEl.value;
    try {
        JSON.parse(responseEl.value);
        await window.go.main.App.AddEndpoint(methodEl.value, pathValue, responseEl.value);
        form.reset();
        loadEndpoints();
    } catch (e) {
        console.error('Erro ao adicionar endpoint:', e);
        const friendlyMessage = e.toString().includes('JSON')
            ? 'O formato da resposta JSON é inválido.'
            : `Erro ao adicionar endpoint: ${e}`;
        showToast(friendlyMessage);
    }
});

window.removeEndpoint = async (id) => {
    try {
        await window.go.main.App.RemoveEndpoint(id);
        loadEndpoints();
    } catch (e) {
        console.error('Erro ao remover endpoint:', e);
        showToast(`Erro ao remover endpoint: ${e}`);
    }
};

// --- Lógica do Servidor ---
const updateServerStatus = (message, url, isRunning) => {
    if (isRunning) {
        statusEl.innerHTML = `${message} <a href="${url}" target="_blank" class="font-bold text-white underline">${url}</a>`;
    } else {
        statusEl.textContent = message;
    }
    statusEl.classList.toggle('bg-status-running-bg', isRunning);
    statusEl.classList.toggle('text-status-running-text', isRunning);
    statusEl.classList.toggle('bg-status-stopped-bg', !isRunning);
    statusEl.classList.toggle('text-status-stopped-text', !isRunning);
};

startBtn.addEventListener('click', async () => {
    if (!portEl.value) {
        showToast('Por favor, insira uma porta antes de iniciar o servidor.');
        return;
    }
    try {
        await window.go.main.App.StartServer(portEl.value);
    } catch (e) {
        console.error('Erro ao iniciar servidor:', e);
        showToast(`Erro ao iniciar o servidor: ${e}`);
    }
});

stopBtn.addEventListener('click', async () => {
    try {
        await window.go.main.App.StopServer();
    } catch (e) {
        console.error('Erro ao parar servidor:', e);
        showToast(`Erro ao parar o servidor: ${e}`);
    }
});

// --- Listeners de Eventos do Wails ---
window.runtime.EventsOn('server-status', updateServerStatus);
window.runtime.EventsOn('server-error', (errorMessage) => {
    showToast(errorMessage);
});

// --- Inicialização ---
const initialize = () => {
    createIcons({ icons });
    loadEndpoints();
    updateServerStatus('Servidor parado', '', false);
};

if (window.go) {
    initialize();
} else {
    window.runtime.EventsOn('wails:ready', initialize);
}
