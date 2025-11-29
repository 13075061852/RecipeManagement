import { Table, Badge } from '../components.js';
import { formatCurrency, formatDate } from '../utils.js';
import { store } from '../store.js';

export const renderStockChanges = (state) => {
    const div = document.createElement('div');
    div.className = 'space-y-6 animate-fade-in';

    // 获取所有库存变更记录，按时间倒序排列
    // 确保state.stockChanges存在且为数组
    const stockChanges = state.stockChanges && Array.isArray(state.stockChanges) 
        ? [...state.stockChanges].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        : [];

    // 定义变更类型映射
    const changeTypeMap = {
        'in': '入库',
        'out': '出库',
        'initial': '初始库存'
    };

    // 定义原因类型映射
    const reasonMap = {
        'receipt': '收货',
        'shipment': '出货',
        'production': '生产',
        'transfer': '调拨',
        'sampling': '送样',
        'adjustment': '库存调整',
        'system_init': '系统初始化',
        'other': '其他'
    };

    const headers = ['时间', '化学品名称', '变更类型', '变更数量', '变更后库存', '原因', '操作人'];

    const renderRow = (item, index) => {
        switch (index) {
            case 0: return `<span class="text-textMuted text-sm">${formatDate(item.timestamp)}</span>`;
            case 1: return `<span class="font-medium text-text">${item.ingredientName}</span>`;
            case 2: return `
                <span class="${item.changeType === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2.5 py-0.5 rounded-full text-xs font-medium">
                    ${changeTypeMap[item.changeType] || item.changeType}
                </span>
            `;
            case 3: return `
                <span class="${item.changeType === 'in' ? 'text-green-600' : 'text-red-600'} font-medium">
                    ${item.changeType === 'in' ? '+' : '-'}${item.changeAmount} ${item.unit}
                </span>
            `;
            case 4: return `<span class="font-medium">${item.newStock} ${item.unit}</span>`;
            case 5: return `<span class="text-textMuted text-sm">${reasonMap[item.reason] || item.reason}</span>`;
            case 6: return `<span class="text-textMuted text-sm">${item.operator}</span>`;
            default: return '';
        }
    };

    div.innerHTML = `
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">库存变更记录</h2>
            <div class="flex space-x-2">
                <select id="change-type-filter" class="px-3 py-2 border border-border rounded-md bg-background text-text text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="all">所有类型</option>
                    <option value="in">入库</option>
                    <option value="out">出库</option>
                </select>
                <button id="refresh-btn" class="bg-surface hover:bg-surfaceHover border border-border px-3 py-2 rounded-md text-text text-sm flex items-center transition-colors">
                    <i data-lucide="refresh-ccw" class="w-4 h-4 mr-1"></i> 刷新
                </button>
            </div>
        </div>
        
        <div class="bg-surface border border-border rounded-xl overflow-hidden">
            ${Table({ headers, rows: stockChanges, renderCell: renderRow })}
        </div>
        
        ${stockChanges.length === 0 ? `
            <div class="bg-surface border border-border rounded-xl p-8 text-center">
                <i data-lucide="package" class="w-12 h-12 text-textMuted mx-auto mb-4"></i>
                <h3 class="text-lg font-medium text-text mb-2">暂无库存变更记录</h3>
                <p class="text-textMuted">当有库存变动时，记录将显示在这里</p>
            </div>
        ` : ''}
    `;

    // 添加过滤功能
    setTimeout(() => {
        const filterSelect = div.querySelector('#change-type-filter');
        const refreshBtn = div.querySelector('#refresh-btn');
        
        if (filterSelect) {
            filterSelect.addEventListener('change', () => {
                const filterValue = filterSelect.value;
                let filteredChanges = stockChanges;
                
                if (filterValue !== 'all') {
                    filteredChanges = stockChanges.filter(change => change.changeType === filterValue);
                }
                
                const tableContainer = div.querySelector('.overflow-hidden');
                if (tableContainer) {
                    tableContainer.innerHTML = Table({ headers, rows: filteredChanges, renderCell: renderRow });
                    lucide.createIcons();
                }
            });
        }
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                // 重新渲染页面
                const newDiv = renderStockChanges(store.state);
                div.replaceWith(newDiv);
            });
        }
        
        // 初始化Lucide图标
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }, 0);

    return div;
};