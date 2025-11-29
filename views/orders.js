import { Table, Badge } from '../components.js';
import { store } from '../store.js';
import { formatDate } from '../utils.js';

export const renderOrders = (state) => {
    const div = document.createElement('div');
    div.className = 'space-y-6 animate-fade-in';


    const columns = [
        { id: 'pending', title: '待处理', color: 'border-yellow-400' },
        { id: 'processing', title: '生产中', color: 'border-blue-400' },
        { id: 'completed', title: '已完成', color: 'border-green-400' }
    ];

    const renderKanbanCard = (order) => {
        const itemsSummary = order.items.map(item => {
            const r = store.getRecipe(item.recipeId);
            return `${r ? r.name : item.recipeId} x${item.qty}`;
        }).join(', ');

        return `
            <div class="bg-surface p-4 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing mb-3">
                <div class="flex justify-between items-start mb-2">
                    <span class="font-semibold text-sm">${order.customer}</span>
                    <span class="text-xs text-textMuted font-mono">#${order.id}</span>
                </div>
                <p class="text-xs text-textMuted mb-3 line-clamp-2">${itemsSummary}</p>
                <div class="flex justify-between items-center text-xs">
                    <span class="text-textMuted">${formatDate(order.date)}</span>
                    <div class="w-6 h-6 rounded-full bg-surfaceHover flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                        <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </div>
                </div>
            </div>
        `;
    };

    div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-bold">订单看板</h2>
            <div class="flex space-x-2">
                 <button class="p-2 rounded-md bg-surface border border-border text-text"><i data-lucide="layout-grid" class="w-4 h-4"></i></button>
                 <button class="p-2 rounded-md text-textMuted hover:bg-surface"><i data-lucide="list" class="w-4 h-4"></i></button>
            </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)] overflow-hidden">
            ${columns.map(col => `
                <div class="flex flex-col h-full bg-surface/30 rounded-xl border border-border/50">
                    <div class="p-3 border-b border-border flex justify-between items-center border-t-4 ${col.color}">
                        <h3 class="font-medium text-sm">${col.title}</h3>
                        <span class="bg-surface px-2 py-0.5 rounded text-xs text-textMuted">${state.orders.filter(o => o.status === col.id).length}</span>
                    </div>
                    <div class="p-3 overflow-y-auto flex-1">
                        ${state.orders.filter(o => o.status === col.id).map(renderKanbanCard).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    return div;
};
