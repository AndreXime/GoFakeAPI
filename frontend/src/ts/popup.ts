import { refreshIcons } from './ui';

const toastContainer = document.getElementById('toast-container');

export default function showMessage(message: string) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast bg-gray-800 rounded-xl shadow-2xl p-4 w-full border border-red-500/50 flex items-start';
    toast.innerHTML = `
    <div class="flex-shrink-0 pt-0.5">
        <i data-lucide="alert-triangle" class="w-6 h-6 text-red-400"></i>
    </div>
    <div class="ml-3 flex-1">
        <p class="text-sm font-semibold text-red-400">Ocorreu um Erro</p>
        <p class="mt-1 text-sm text-gray-300">${message}</p>
    </div>
    <div class="ml-4 flex-shrink-0 flex">
        <button class="close-toast-btn inline-flex text-gray-400 hover:text-white transition-colors">
            <i data-lucide="x" class="w-5 h-5"></i>
        </button>
    </div>`;
    toastContainer.appendChild(toast);
    refreshIcons();
    const removeToast = () => {
        toast.classList.add('closing');
        toast.addEventListener('animationend', () => toast.remove());
    };
    toast.querySelector('.close-toast-btn')?.addEventListener('click', removeToast);
    setTimeout(removeToast, 10000);
}
