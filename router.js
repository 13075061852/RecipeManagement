import { store } from './store.js';
import { renderDashboard } from './views/dashboard.js';
import { renderInventory } from './views/inventory.js';
import { renderRecipes } from './views/recipes.js';
import { renderProduction } from './views/production.js';
import { renderOrders } from './views/orders.js';
import { renderStockChanges } from './views/stockChanges.js';
import { renderRecipeFormulation } from './views/recipeFormulation.js';

const routes = {
    'dashboard': { label: '概览', icon: 'layout-dashboard', render: renderDashboard },
    'inventory': { label: '库存管理', icon: 'package', render: renderInventory },
    'stock-changes': { label: '库存变更', icon: 'repeat', render: renderStockChanges },
    'recipes': { label: '配方中心', icon: 'book-open', render: renderRecipes },
    'recipe-formulation': { label: '配方调试', icon: 'beaker', render: renderRecipeFormulation },
    'production': { label: '生产计划', icon: 'factory', render: renderProduction },
    'orders': { label: '订单管理', icon: 'shopping-cart', render: renderOrders },
};

export class Router {
    constructor() {
        this.currentRoute = 'dashboard';
        this.container = document.getElementById('app-content');
        this.navContainer = document.getElementById('nav-links');
        this.titleElement = document.getElementById('page-title');
        
        window.addEventListener('hashchange', () => this.handleRoute());
        this.initNav();
        this.handleRoute();
    }

    initNav() {
        this.navContainer.innerHTML = Object.entries(routes).map(([key, route]) => {
            // 隐藏配方调试页面在导航栏中显示
            if (key === 'recipe-formulation') return '';
            
            return `
                <a href="#${key}" 
                   class="nav-item group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 text-textMuted hover:bg-surfaceHover hover:text-text"
                   data-route="${key}">
                    <i data-lucide="${route.icon}" class="flex-shrink-0 w-5 h-5 mr-3 text-textMuted group-hover:text-text transition-colors"></i>
                    ${route.label}
                </a>
            `;
        }).join('');
    }

    handleRoute() {
        // 提取路由和查询参数
        const hashWithQuery = window.location.hash.slice(1) || 'dashboard';
        const [hash, query] = hashWithQuery.split('?');
        console.log('Handling route:', hash, 'with query:', query); // 添加调试输出
        
        if (routes[hash]) {
            this.currentRoute = hash;
            this.updateActiveNav();
            this.titleElement.textContent = routes[hash].label;

            this.container.innerHTML = '<div class="animate-pulse space-y-4"><div class="h-8 bg-surfaceHover rounded w-1/3"></div><div class="h-32 bg-surfaceHover rounded"></div></div>';
            
            console.log('Loading route:', routes[hash].label); // 添加调试输出

            requestAnimationFrame(() => {
                this.container.innerHTML = '';
                console.log('Container cleared'); // 添加调试输出
                
                // 将查询参数传递给页面渲染函数
                const view = routes[hash].render(store.state, query);
                console.log('View rendered, type:', typeof view); // 添加调试输出
                console.log('View is HTMLElement:', view instanceof HTMLElement); // 添加调试输出
                
                if (view && view instanceof HTMLElement) {
                    this.container.appendChild(view);
                    console.log('View appended to container'); // 添加调试输出
                } else {
                    console.error('View is not a valid HTMLElement'); // 添加调试输出
                    this.container.innerHTML = '<div class="p-4 text-red-500">页面渲染错误</div>';
                }
                
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    lucide.createIcons();
                }
            });
        } else {
            console.error('Route not found:', hash); // 添加调试输出
            this.container.innerHTML = '<div class="p-4 text-red-500">页面未找到</div>';
        }
    }

    updateActiveNav() {
        document.querySelectorAll('.nav-item').forEach(el => {
            if (el.dataset.route === this.currentRoute) {
                el.classList.add('bg-surfaceHover', 'text-text');
                el.classList.remove('text-textMuted');
                // 安全地访问图标元素
                const icon = el.querySelector('i');
                if (icon) {
                    icon.classList.add('text-primary');
                    icon.classList.remove('text-textMuted');
                }
            } else {
                el.classList.remove('bg-surfaceHover', 'text-text');
                el.classList.add('text-textMuted');
                // 安全地访问图标元素
                const icon = el.querySelector('i');
                if (icon) {
                    icon.classList.remove('text-primary');
                    icon.classList.add('text-textMuted');
                }
            }
        });
    }
}