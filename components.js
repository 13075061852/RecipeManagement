import { translateStatus, getStatusColor } from './utils.js';

export const Card = ({ title, value, subtitle, icon, trend }) => {
    return `
        <div class="bg-surface border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <p class="text-textMuted text-xs font-medium uppercase tracking-wider">${title}</p>
                    <h3 class="text-2xl font-semibold mt-1 text-text">${value}</h3>
                </div>
                <div class="p-2 bg-surfaceHover rounded-lg text-textMuted">
                    <i data-lucide="${icon}" class="w-5 h-5"></i>
                </div>
            </div>
            <div class="flex items-center text-xs">
                <span class="${trend === 'up' ? 'text-green-500' : 'text-red-500'} flex items-center font-medium">
                    ${subtitle}
                </span>
                <span class="text-textMuted ml-2">较上周</span>
            </div>
        </div>
    `;
};

export const Badge = (status) => {
    const colorClass = getStatusColor(status);
    const label = translateStatus(status);
    return `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${colorClass}">${label}</span>`;
};

export const Table = ({ headers, rows, renderCell }) => {
    const thead = headers.map(h => `<th class="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">${h}</th>`).join('');
    
    const tbody = rows.map(row => {
        return `<tr class="table-row-hover transition-colors border-b border-border last:border-0">
            ${headers.map((_, index) => `<td class="px-6 py-4 whitespace-nowrap text-sm text-text">${renderCell(row, index)}</td>`).join('')}
        </tr>`;
    }).join('');

    return `
        <div class="overflow-x-auto rounded-xl border border-border bg-surface">
            <table class="min-w-full border-collapse">
                <thead class="bg-surfaceHover sticky top-0 z-10 shadow-sm"><tr>${thead}</tr></thead>
                <tbody>${tbody}</tbody>
            </table>
        </div>
    `;
};

export const Modal = (title, contentHtml, actionText = 'Confirm') => {
    return `
        <div class="bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in max-h-[80vh] flex flex-col">
            <div class="px-6 py-4 border-b border-border flex justify-between items-center">
                <h3 class="text-lg font-semibold text-text">${title}</h3>
                <button id="modal-close" class="text-textMuted hover:text-text"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div class="p-6 overflow-y-auto">
                ${contentHtml}
            </div>
            <div class="px-6 py-4 bg-surface border-t border-border flex justify-end space-x-3">
                <button id="modal-cancel" class="px-4 py-2 text-sm font-medium text-textMuted hover:text-text transition-colors">取消</button>
                <button id="modal-confirm" class="px-4 py-2 text-sm font-medium bg-primary text-background rounded-lg hover:bg-primaryHover transition-colors shadow-sm">${actionText}</button>
            </div>
        </div>
    `;
};

// 小尺寸弹窗组件，用于表单等简单内容
export const SmallModal = (title, contentHtml, actionText = 'Confirm') => {
    return `
        <div class="bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-fade-in max-h-[80vh] flex flex-col w-full max-w-md mx-auto">
            <div class="px-5 py-3 border-b border-border flex justify-between items-center">
                <h3 class="text-base font-semibold text-text">${title}</h3>
                <button id="modal-close" class="text-textMuted hover:text-text"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <div class="p-5 overflow-y-auto">
                ${contentHtml}
            </div>
            <div class="px-5 py-3 bg-surface border-t border-border flex justify-end space-x-2">
                <button id="modal-cancel" class="px-3 py-1.5 text-sm font-medium text-textMuted hover:text-text transition-colors">取消</button>
                <button id="modal-confirm" class="px-3 py-1.5 text-sm font-medium bg-primary text-background rounded-md hover:bg-primaryHover transition-colors shadow-sm">${actionText}</button>
            </div>
        </div>
    `;
};
