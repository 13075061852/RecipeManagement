import { Table, Badge } from '../components.js';
import { store } from '../store.js';
import { formatDate } from '../utils.js';

export const renderProduction = (state) => {
    const div = document.createElement('div');
    div.className = 'space-y-6 animate-fade-in';

    const headers = ['生产单号', '产品名称', '计划数量', '生产日期', '状态', '进度'];

    const renderRow = (plan, index) => {
        const recipe = store.getRecipe(plan.recipeId);
        switch (index) {
            case 0: return `<span class="font-mono text-xs text-textMuted">#${plan.id}</span>`;
            case 1: return `<span class="font-medium text-text">${recipe ? recipe.name : 'Unknown'}</span>`;
            case 2: return `${plan.planQty} ${recipe ? recipe.unit : ''}`;
            case 3: return formatDate(plan.date);
            case 4: return Badge(plan.status);
            case 5: 
                const pct = plan.status === 'in_progress' ? 60 : (plan.status === 'completed' ? 100 : 0);
                return `
                <div class="w-24 h-2 bg-surfaceHover rounded-full overflow-hidden">
                    <div class="h-full bg-primary" style="width: ${pct}%"></div>
                </div>`;
            default: return '';
        }
    };

    div.innerHTML = `
        <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">生产排期</h2>
            <button class="bg-primary text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center">
                <i data-lucide="calendar-plus" class="w-4 h-4 mr-2"></i> 新增计划
            </button>
        </div>
        
        <!-- Simple Gantt visual placeholder -->
        <div class="bg-surface border border-border rounded-xl p-4 mb-6 overflow-x-auto">
            <div class="flex space-x-4 min-w-max pb-2">
                ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => `
                    <div class="flex-1 min-w-[120px]">
                        <div class="text-xs text-textMuted uppercase font-bold mb-2 text-center">${day}</div>
                        <div class="h-32 bg-surfaceHover/50 rounded-lg border border-dashed border-border relative p-1">
                           <!-- Mock items -->
                           ${day === 'Mon' ? '<div class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs p-2 rounded mb-1 truncate">经典可颂</div>' : ''}
                           ${day === 'Tue' ? '<div class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs p-2 rounded mb-1 truncate">巧克力蛋糕</div>' : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        ${Table({ headers, rows: state.production, renderCell: renderRow })}
    `;

    return div;
};
