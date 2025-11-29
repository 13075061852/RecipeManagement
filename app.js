import { Router } from './router.js';
import { store } from './store.js';


document.addEventListener('DOMContentLoaded', () => {

    const router = new Router();


    const themeToggleBtn = document.getElementById('theme-toggle');
    

    // 只有当主题切换按钮存在时才执行主题相关逻辑
    if (themeToggleBtn) {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            updateThemeIcon(true);
        } else {
            document.documentElement.classList.remove('dark');
            updateThemeIcon(false);
        }

        themeToggleBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
            updateThemeIcon(isDark);
        });

        function updateThemeIcon(isDark) {
            const icon = themeToggleBtn.querySelector('i');
            const text = themeToggleBtn.querySelector('span');
            
            // 确保图标和文本元素存在
            if (icon && text) {
                if (isDark) {
                    icon.setAttribute('data-lucide', 'sun');
                    text.textContent = '浅色模式';
                } else {
                    icon.setAttribute('data-lucide', 'moon');
                    text.textContent = '深色模式';
                }
                lucide.createIcons();
            }
        }
    }


    const mobileBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileBtn && sidebar) {
        mobileBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-hidden');
            sidebar.classList.toggle('mobile-visible');
        });
    }


    store.subscribe(() => {


        router.handleRoute(); 
    });
});