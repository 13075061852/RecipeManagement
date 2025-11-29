import { Card, Table, Badge, Modal } from '../components.js';
import { formatCurrency, formatDate } from '../utils.js';

export const renderDashboard = (state) => {
    const div = document.createElement('div');
    div.className = 'space-y-6 animate-fade-in';

    // 获取库存预警的化学品
    const lowStockItems = state.ingredients.filter(i => i.stock <= i.minStock);

    const lowStockCount = lowStockItems.length;
    const pendingOrders = state.orders.filter(o => o.status === 'pending').length;
    const activeProduction = state.production.filter(p => p.status === 'in_progress').length;
    const totalRecipes = state.recipes.length;

    // 确保state.stockChanges存在且为数组
    const stockChangesCount = state.stockChanges && Array.isArray(state.stockChanges) 
        ? state.stockChanges.length 
        : 0;

    div.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div id="low-stock-card" class="cursor-pointer">
                ${Card({ title: '库存预警', value: lowStockCount, subtitle: '需补货', icon: 'alert-circle', trend: 'down' })}
            </div>
            ${Card({ title: '待处理订单', value: pendingOrders, subtitle: '今日新增', icon: 'clipboard-list', trend: 'up' })}
            ${Card({ title: '生产中', value: activeProduction, subtitle: '当前批次', icon: 'activity', trend: 'up' })}
            <div id="stock-changes-card" class="cursor-pointer">
                ${Card({ title: '库存变更', value: stockChangesCount, subtitle: '近期记录', icon: 'repeat', trend: 'neutral' })}
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Chart Area -->
            <div class="lg:col-span-2 bg-surface border border-border rounded-xl p-6">
                <h3 class="text-lg font-semibold mb-4">生产趋势 (近7天)</h3>
                <canvas id="productionChart" height="120"></canvas>
            </div>

            <!-- Recent Activity -->
            <div class="bg-surface border border-border rounded-xl p-6">
                <h3 class="text-lg font-semibold mb-4">最近订单</h3>
                <div class="space-y-4">
                    ${state.orders.slice(0, 4).map(order => `
                        <div class="flex items-center justify-between p-3 hover:bg-surfaceHover rounded-lg transition-colors border border-transparent hover:border-border">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                                    <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-text">${order.customer}</p>
                                    <p class="text-xs text-textMuted">${formatDate(order.date)}</p>
                                </div>
                            </div>
                            ${Badge(order.status)}
                        </div>
                    `).join('')}
                </div>
                <button class="w-full mt-4 py-2 text-sm text-primary hover:bg-surfaceHover rounded-lg transition-colors">查看全部</button>
            </div>
        </div>
    `;

    // 添加显示库存预警详情的函数到全局作用域
    window.showLowStockDetails = function() {
        const modalContent = `
            <div class="space-y-4">
                <p class="text-textMuted">以下化学品库存已低于最低库存阈值，请及时补货：</p>
                <div class="overflow-x-auto rounded-xl border border-border bg-surface">
                    <table class="min-w-full border-collapse">
                        <thead class="bg-surfaceHover">
                            <tr>
                                <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">化学品名称</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">当前库存</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">最低库存</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">分类</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${lowStockItems.map(item => `
                                <tr class="table-row-hover transition-colors border-b border-border last:border-0">
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-text font-medium">${item.name}</td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-text">
                                        <span class="text-red-500 font-bold">${item.stock}</span> ${item.unit}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-text">${item.minStock} ${item.unit}</td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-textMuted">${item.category}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex items-start">
                        <i data-lucide="alert-circle" class="w-5 h-5 text-red-500 mr-2 mt-0.5"></i>
                        <div>
                            <p class="text-sm font-medium text-red-800">补货建议</p>
                            <p class="text-sm text-red-700 mt-1">请尽快联系供应商补货，以避免影响生产计划。</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        showCustomModal('库存预警详情', modalContent, '关闭');
    };

    // 显示自定义模态框的函数
    function showCustomModal(title, contentHtml, actionText) {
        const modalRoot = document.getElementById('modal-root');
        const modalContentWrapper = document.getElementById('modal-content-wrapper');
        
        modalContentWrapper.innerHTML = Modal(title, contentHtml, actionText);
        
        // 使用setTimeout确保DOM元素已经渲染完成后再绑定事件
        setTimeout(() => {
            // 绑定事件
            const closeBtn = document.getElementById('modal-close');
            const cancelBtn = document.getElementById('modal-cancel');
            const confirmBtn = document.getElementById('modal-confirm');
            const backdrop = document.getElementById('modal-backdrop');
            
            if (closeBtn) closeBtn.addEventListener('click', hideModal);
            if (cancelBtn) cancelBtn.addEventListener('click', hideModal);
            if (confirmBtn) confirmBtn.addEventListener('click', hideModal);
            if (backdrop) backdrop.addEventListener('click', hideModal);
        }, 0);
        
        modalRoot.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // 隐藏模态框的函数
    function hideModal() {
        const modalRoot = document.getElementById('modal-root');
        modalRoot.classList.add('hidden');
        document.body.style.overflow = '';
    }

    setTimeout(() => {
        const ctx = div.querySelector('#productionChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: '产量',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        borderColor: window.getComputedStyle(document.body).getPropertyValue('--primary'),
                        tension: 0.4,
                        fill: true,
                        backgroundColor: 'rgba(100, 100, 100, 0.05)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(128, 128, 128, 0.1)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
        }
        
        // 绑定库存预警卡片点击事件
        const lowStockCard = div.querySelector('#low-stock-card');
        if (lowStockCard && lowStockCount > 0) {
            lowStockCard.addEventListener('click', window.showLowStockDetails);
        }
        
        // 绑定库存变更卡片点击事件
        const stockChangesCard = div.querySelector('#stock-changes-card');
        if (stockChangesCard) {
            stockChangesCard.addEventListener('click', () => {
                // 跳转到库存变更页面
                window.location.hash = '#stock-changes';
            });
        }
        
        // 初始化Lucide图标
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }, 0);

    return div;
};