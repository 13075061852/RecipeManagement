import { store } from '../store.js';
import { formatCurrency } from '../utils.js';
import { Modal } from '../components.js';

export const renderRecipes = (state) => {
    const div = document.createElement('div');
    div.className = 'space-y-6 animate-fade-in';

    // 渲染配方卡片
    const renderCard = (recipe) => {
        const cost = store.getCost(recipe.id);
        const sellingPrice = store.getSellingPrice(recipe.id);
        const baseIngredientCount = recipe.modules?.base?.ingredients?.length || 0;
        const colorIngredientCount = recipe.modules?.color?.ingredients?.length || 0;
        
        // 获取所有原料信息
        const allIngredients = store.state.ingredients || [];
        
        // 获取配方中使用的属于"原料"类别的具体原材料
        const materialIngredients = [];
        
        // 收集基础原料中属于"原料"类别的原材料
        if (recipe.modules?.base?.ingredients) {
            recipe.modules.base.ingredients.forEach(item => {
                const ingredient = allIngredients.find(ing => ing.id === item.id);
                if (ingredient && ingredient.category === '原料') {
                    materialIngredients.push({
                        name: ingredient.name,
                        ratio: item.ratio
                    });
                }
            });
        }
        
        // 收集配色剂中属于"原料"类别的原材料
        if (recipe.modules?.color?.ingredients) {
            recipe.modules.color.ingredients.forEach(item => {
                const ingredient = allIngredients.find(ing => ing.id === item.id);
                if (ingredient && ingredient.category === '原料') {
                    materialIngredients.push({
                        name: ingredient.name,
                        ratio: item.ratio
                    });
                }
            });
        }
        
        // 按比例从高到低排序，只显示前3个主要原料
        const sortedMaterials = materialIngredients
            .sort((a, b) => b.ratio - a.ratio)
            .slice(0, 3);

        return `
            <div class="bg-surface border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all group cursor-pointer relative h-full flex flex-col" 
                 onclick="showRecipeDetails('${recipe.id}')">
                <div class="p-3 flex-grow flex flex-col">
                    <h3 class="font-semibold text-base mb-1 group-hover:text-primary transition-colors truncate">${recipe.name}</h3>
                    <div class="text-textMuted text-xs mb-2 flex justify-between">
                        <span>分类: ${recipe.category}</span>
                        <span>产量: ${recipe.yield}${recipe.unit}</span>
                    </div>
                    
                    <!-- 使用的"原料"类别中的具体原材料展示 -->
                    ${sortedMaterials.length > 0 ? `
                        <div class="flex gap-1 mb-2">
                            ${sortedMaterials.map(material => `
                                <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" title="${material.name}">
                                    ${material.name}: ${material.ratio}%
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="flex gap-1 mb-2">
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            基础: ${baseIngredientCount}
                        </span>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                            配色: ${colorIngredientCount}
                        </span>
                    </div>
                    
                    <div class="flex justify-between items-center mt-auto pt-2 border-t border-border">
                        <div class="text-xs text-textMuted">
                            <span class="block">成本</span>
                            <span class="text-text font-medium">${formatCurrency(cost)}/kg</span>
                        </div>
                        <div class="text-xs text-textMuted text-right">
                            <span class="block">售价</span>
                            <span class="text-text font-medium">${formatCurrency(sellingPrice)}/kg</span>
                        </div>
                    </div>
                </div>
                
                <div class="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="edit-recipe-btn bg-white dark:bg-gray-700 p-1 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600" 
                            onclick="event.stopPropagation(); editRecipe('${recipe.id}')">
                        <i data-lucide="pencil" class="w-3 h-3 text-text"></i>
                    </button>
                    <button class="delete-recipe-btn bg-white dark:bg-gray-700 p-1 rounded-full shadow-sm hover:bg-red-100 dark:hover:bg-red-900" 
                            onclick="event.stopPropagation(); deleteRecipe('${recipe.id}')">
                        <i data-lucide="trash-2" class="w-3 h-3 text-red-500"></i>
                    </button>
                </div>
            </div>
        `;
    };

    // 检查是否有配方数据
    const hasRecipes = state.recipes && Array.isArray(state.recipes) && state.recipes.length > 0;
    
    // 获取所有唯一的分类
    const categories = [...new Set(state.recipes.map(recipe => recipe.category))];
    
    // 获取所有唯一的原料名称（从配方卡片上显示的原料信息）
    const materialNames = new Set();
    state.recipes.forEach(recipe => {
        // 获取配方中使用的属于"原料"类别的具体原材料
        const allIngredients = store.state.ingredients || [];
        const materialIngredients = [];
        
        // 收集基础原料中属于"原料"类别的原材料
        if (recipe.modules?.base?.ingredients) {
            recipe.modules.base.ingredients.forEach(item => {
                const ingredient = allIngredients.find(ing => ing.id === item.id);
                if (ingredient && ingredient.category === '原料') {
                    materialIngredients.push(ingredient.name);
                }
            });
        }
        
        // 收集配色剂中属于"原料"类别的原材料
        if (recipe.modules?.color?.ingredients) {
            recipe.modules.color.ingredients.forEach(item => {
                const ingredient = allIngredients.find(ing => ing.id === item.id);
                if (ingredient && ingredient.category === '原料') {
                    materialIngredients.push(ingredient.name);
                }
            });
        }
        
        // 添加到集合中
        materialIngredients.forEach(name => materialNames.add(name));
    });
    
    div.innerHTML = `
        <div class="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
                <!-- 一级分类tab -->
                <div class="flex space-x-1 mb-2">
                    <button class="category-tab px-3 py-1 rounded-full bg-primary text-background text-xs font-medium" data-category="all">全部</button>
                    ${categories.map(category => `
                        <button class="category-tab px-3 py-1 rounded-full border border-border text-textMuted hover:text-text text-xs font-medium transition-colors" data-category="${category}">${category}</button>
                    `).join('')}
                </div>
                
                <!-- 原料筛选tab -->
                <div class="material-tabs flex space-x-1 ${categories.length > 0 ? '' : 'hidden'}">
                    <button class="material-tab px-3 py-1 rounded-full bg-primary text-background text-xs font-medium transition-colors mr-1" data-material="all">全部原料</button>
                    ${[...materialNames].map(material => `
                        <button class="material-tab px-3 py-1 rounded-full bg-background border border-border text-text hover:text-primary text-xs font-medium transition-colors mr-1" data-material="${material}">
                            ${material}
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <div class="relative">
                    <input type="text" id="recipe-search" placeholder="搜索配方名称..." 
                           class="pl-8 pr-4 py-1.5 text-sm border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary w-48">
                    <i data-lucide="search" class="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-textMuted"></i>
                </div>
                <button id="add-recipe-btn" class="bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center">
                    <i data-lucide="plus" class="w-3 h-3 mr-1"></i> 新建配方
                </button>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            ${hasRecipes ? state.recipes.map(renderCard).join('') : `
                <div class="col-span-full text-center py-6">
                    <i data-lucide="flask-conical" class="w-8 h-8 mx-auto text-textMuted mb-2"></i>
                    <h3 class="text-base font-medium text-text mb-1">暂无配方</h3>
                    <p class="text-textMuted text-sm mb-2">点击"新建配方"按钮创建您的第一个配方</p>
                    <button id="add-recipe-btn-placeholder" class="bg-primary text-background px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity flex items-center mx-auto">
                        <i data-lucide="plus" class="w-3 h-3 mr-1"></i> 新建配方
                    </button>
                </div>
            `}
        </div>
    `;

    // 添加事件监听器的函数
    function attachEventListeners() {
        // 确保DOM已经完全渲染后再绑定事件
        setTimeout(() => {
            // 添加新建配方按钮事件
            const addRecipeBtn = document.getElementById('add-recipe-btn');
            if (addRecipeBtn) {
                addRecipeBtn.addEventListener('click', () => {
                    console.log('11'); // 添加控制台输出
                    // 导航到配方调试页面
                    window.location.hash = '#recipe-formulation';
                });
            }
            
            // 添加占位符新建配方按钮事件
            const addRecipeBtnPlaceholder = document.getElementById('add-recipe-btn-placeholder');
            if (addRecipeBtnPlaceholder) {
                addRecipeBtnPlaceholder.addEventListener('click', () => {
                    console.log('11'); // 添加控制台输出
                    // 导航到配方调试页面
                    window.location.hash = '#recipe-formulation';
                });
            }
            
            // 添加分类tab切换事件
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    const category = this.dataset.category;
                    
                    // 更新tab样式
                    document.querySelectorAll('.category-tab').forEach(t => {
                        if (t.dataset.category === category) {
                            t.classList.remove('border-border', 'text-textMuted');
                            t.classList.add('bg-primary', 'text-background');
                        } else {
                            t.classList.remove('bg-primary', 'text-background');
                            t.classList.add('border-border', 'text-textMuted');
                        }
                    });
                    
                    // 显示原料筛选tab
                    const materialTabs = document.querySelector('.material-tabs');
                    if (materialTabs) {
                        materialTabs.classList.remove('hidden');
                    }
                    
                    // 获取搜索词
                    const searchInput = document.getElementById('recipe-search');
                    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
                    
                    // 过滤并显示配方卡片
                    const recipesContainer = document.querySelector('.grid.grid-cols-1');
                    if (recipesContainer) {
                        // 清空现有内容
                        recipesContainer.innerHTML = '';
                        
                        // 获取过滤后的配方数据
                        let filteredRecipes = state.recipes;
                        
                        // 先按分类过滤
                        if (category !== 'all') {
                            filteredRecipes = filteredRecipes.filter(recipe => recipe.category === category);
                        }
                        
                        // 再按搜索词过滤
                        if (searchTerm) {
                            filteredRecipes = filteredRecipes.filter(recipe => 
                                recipe.name.toLowerCase().includes(searchTerm)
                            );
                        }
                        
                        // 渲染过滤后的配方卡片
                        if (filteredRecipes.length > 0) {
                            recipesContainer.innerHTML = filteredRecipes.map(renderCard).join('');
                        } else {
                            if (searchTerm) {
                                recipesContainer.innerHTML = `
                                    <div class="col-span-full text-center py-8">
                                        <i data-lucide="search-x" class="w-8 h-8 mx-auto text-textMuted mb-2"></i>
                                        <h3 class="text-base font-medium text-text mb-1">未找到匹配的配方</h3>
                                        <p class="text-textMuted text-sm mb-3">没有找到名称包含 "${searchTerm}" 的配方</p>
                                    </div>
                                `;
                            } else {
                                recipesContainer.innerHTML = `
                                    <div class="col-span-full text-center py-8">
                                        <i data-lucide="flask-conical" class="w-8 h-8 mx-auto text-textMuted mb-2"></i>
                                        <h3 class="text-base font-medium text-text mb-1">暂无配方</h3>
                                        <p class="text-textMuted text-sm mb-3">该分类下暂无配方</p>
                                    </div>
                                `;
                            }
                        }
                        
                        // 重新初始化Lucide图标
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                            lucide.createIcons();
                        }
                    }
                });
            });
            
            // 初始化二级tab样式
            const activeMaterialTab = document.querySelector('.material-tab[data-material="all"]');
            if (activeMaterialTab) {
                activeMaterialTab.classList.remove('border-border', 'text-textMuted');
                activeMaterialTab.classList.add('bg-primary', 'text-background');
            }
            
            // 设置其他二级tab的默认样式
            document.querySelectorAll('.material-tab:not([data-material="all"])').forEach(t => {
                t.classList.remove('bg-primary', 'text-background');
                t.classList.add('bg-background', 'border-border', 'text-textMuted');
            });
            
            // 原料筛选tab切换事件
            document.querySelector('.material-tabs').addEventListener('click', function(e) {
                if (e.target.classList.contains('material-tab')) {
                    const material = e.target.dataset.material;
                    
                    // 更新原料tab样式
                    document.querySelectorAll('.material-tab').forEach(t => {
                        if (t.dataset.material === material) {
                            // 激活选中的tab
                            t.classList.remove('border-border', 'text-textMuted', 'bg-background');
                            t.classList.add('bg-primary', 'text-background');
                        } else {
                            // 恢复未选中tab的默认样式
                            t.classList.remove('bg-primary', 'text-background');
                            t.classList.add('bg-background', 'border-border', 'text-textMuted');
                        }
                    });
                    
                    // 获取当前主分类
                    const activeMainCategory = document.querySelector('.category-tab.bg-primary').dataset.category;
                    
                    // 获取搜索词
                    const searchInput = document.getElementById('recipe-search');
                    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
                    
                    // 过滤并显示配方卡片
                    const recipesContainer = document.querySelector('.grid.grid-cols-1');
                    if (recipesContainer) {
                        // 清空现有内容
                        recipesContainer.innerHTML = '';
                        
                        // 获取过滤后的配方数据
                        let filteredRecipes = state.recipes;
                        
                        // 先按主分类过滤
                        if (activeMainCategory !== 'all') {
                            filteredRecipes = filteredRecipes.filter(recipe => recipe.category === activeMainCategory);
                        }
                        
                        // 再按原料筛选
                        if (material !== 'all') {
                            // 根据原料筛选配方
                            filteredRecipes = filteredRecipes.filter(recipe => {
                                // 获取配方中使用的属于"原料"类别的具体原材料
                                const allIngredients = store.state.ingredients || [];
                                const materialIngredients = [];
                                
                                // 收集基础原料中属于"原料"类别的原材料
                                if (recipe.modules?.base?.ingredients) {
                                    recipe.modules.base.ingredients.forEach(item => {
                                        const ingredient = allIngredients.find(ing => ing.id === item.id);
                                        if (ingredient && ingredient.category === '原料') {
                                            materialIngredients.push(ingredient.name);
                                        }
                                    });
                                }
                                
                                // 收集配色剂中属于"原料"类别的原材料
                                if (recipe.modules?.color?.ingredients) {
                                    recipe.modules.color.ingredients.forEach(item => {
                                        const ingredient = allIngredients.find(ing => ing.id === item.id);
                                        if (ingredient && ingredient.category === '原料') {
                                            materialIngredients.push(ingredient.name);
                                        }
                                    });
                                }
                                
                                // 检查是否包含指定原料
                                return materialIngredients.includes(material);
                            });
                        }
                        
                        // 再按搜索词过滤
                        if (searchTerm) {
                            filteredRecipes = filteredRecipes.filter(recipe => 
                                recipe.name.toLowerCase().includes(searchTerm)
                            );
                        }
                        
                        // 渲染过滤后的配方卡片
                        if (filteredRecipes.length > 0) {
                            recipesContainer.innerHTML = filteredRecipes.map(renderCard).join('');
                        } else {
                            if (searchTerm) {
                                recipesContainer.innerHTML = `
                                    <div class="col-span-full text-center py-8">
                                        <i data-lucide="search-x" class="w-8 h-8 mx-auto text-textMuted mb-2"></i>
                                        <h3 class="text-base font-medium text-text mb-1">未找到匹配的配方</h3>
                                        <p class="text-textMuted text-sm mb-3">没有找到名称包含 "${searchTerm}" 的配方</p>
                                    </div>
                                `;
                            } else {
                                recipesContainer.innerHTML = `
                                    <div class="col-span-full text-center py-8">
                                        <i data-lucide="flask-conical" class="w-8 h-8 mx-auto text-textMuted mb-2"></i>
                                        <h3 class="text-base font-medium text-text mb-1">暂无配方</h3>
                                        <p class="text-textMuted text-sm mb-3">该分类下暂无配方</p>
                                    </div>
                                `;
                            }
                        }
                        
                        // 重新初始化Lucide图标
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                            lucide.createIcons();
                        }
                    }
                }
            });
            
            // 添加搜索功能事件监听器
            const searchInput = document.getElementById('recipe-search');
            if (searchInput) {
                // 防抖函数，避免频繁触发搜索
                let searchTimeout;
                searchInput.addEventListener('input', function() {
                    // 清除之前的定时器
                    clearTimeout(searchTimeout);
                    
                    // 设置新的定时器
                    searchTimeout = setTimeout(() => {
                        const searchTerm = this.value.trim().toLowerCase();
                        
                        // 获取当前激活的分类
                        const activeCategoryTab = document.querySelector('.category-tab.bg-primary');
                        const currentCategory = activeCategoryTab ? activeCategoryTab.dataset.category : 'all';
                        
                        // 获取过滤后的配方数据
                        let filteredRecipes = state.recipes;
                        
                        // 先按分类过滤
                        if (currentCategory !== 'all') {
                            filteredRecipes = filteredRecipes.filter(recipe => recipe.category === currentCategory);
                        }
                        
                        // 再按搜索词过滤
                        if (searchTerm) {
                            filteredRecipes = filteredRecipes.filter(recipe => 
                                recipe.name.toLowerCase().includes(searchTerm)
                            );
                        }
                        
                        // 渲染过滤后的配方卡片
                        const recipesContainer = document.querySelector('.grid.grid-cols-1');
                        if (recipesContainer) {
                            if (filteredRecipes.length > 0) {
                                recipesContainer.innerHTML = filteredRecipes.map(renderCard).join('');
                            } else {
                                recipesContainer.innerHTML = `
                                    <div class="col-span-full text-center py-8">
                                        <i data-lucide="search-x" class="w-8 h-8 mx-auto text-textMuted mb-2"></i>
                                        <h3 class="text-base font-medium text-text mb-1">未找到匹配的配方</h3>
                                        <p class="text-textMuted text-sm mb-3">没有找到名称包含 "${searchTerm}" 的配方</p>
                                    </div>
                                `;
                            }
                            
                            // 重新初始化Lucide图标
                            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                                lucide.createIcons();
                            }
                        }
                    }, 300); // 300ms防抖延迟
                });
            }
            
            // 初始化Lucide图标
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }, 0);
    }

    // 在DOM渲染完成后附加事件监听器
    setTimeout(() => {
        attachEventListeners();
    }, 0);

    // 添加全局函数供卡片调用
    window.showRecipeDetails = (recipeId) => {
        const recipe = store.getRecipe(recipeId);
        if (!recipe) return;
        
        const cost = store.getCost(recipeId);
        const sellingPrice = store.getSellingPrice(recipeId);
        
        // 显示配方详情模态框
        const modalContent = `
            <div class="mb-6">
                <h3 class="text-xl font-bold mb-2">${recipe.name}</h3>
                <div class="flex flex-wrap gap-4 text-sm text-textMuted">
                    <div>分类: ${recipe.category}</div>
                    <div>产量: ${recipe.yield} ${recipe.unit}</div>
                    <div>创建时间: ${new Date(recipe.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="border border-border rounded-lg p-4">
                    <div class="text-textMuted text-sm">成本</div>
                    <div class="text-2xl font-bold text-text">${formatCurrency(cost)}/kg</div>
                    <div class="text-textMuted text-sm">${formatCurrency(cost * 1000)}/吨</div>
                </div>
                <div class="border border-border rounded-lg p-4">
                    <div class="text-textMuted text-sm">售价</div>
                    <div class="selling-price-value">
                        <div class="text-2xl font-bold text-text">${formatCurrency(sellingPrice)}/kg</div>
                        <div class="text-textMuted text-sm">${formatCurrency(sellingPrice * 1000)}/吨</div>
                    </div>
                </div>
                <div class="border border-border rounded-lg p-4">
                    <div class="text-textMuted text-sm">总利润</div>
                    <div class="total-profit-value">
                        <div class="text-2xl font-bold text-text">${formatCurrency(sellingPrice - cost)}/kg</div>
                        <div class="text-textMuted text-sm">${formatCurrency((sellingPrice - cost) * 1000)}/吨</div>
                    </div>
                </div>
                <div class="border border-border rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-textMuted text-sm">利润率</div>
                            <input type="number" id="profit-margin" step="0.01" min="0" value="${recipe.profitMargin || 0.2}" 
                                   class="w-20 text-lg font-bold text-text bg-transparent border-none focus:outline-none focus:ring-0 p-0">
                        </div>
                        <div>
                            <div class="text-textMuted text-sm">总吨数</div>
                            <input type="number" id="total-tons" min="0" step="0.1" value="1" 
                                   class="w-20 text-lg font-bold text-text bg-transparent border-none focus:outline-none focus:ring-0 p-0">
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="calculation-results">
                <div id="results-content"></div>
            </div>
        `;
        
        // 创建并显示模态框
        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in';
        modalWrapper.innerHTML = Modal('配方详情', modalContent, '关闭');
        document.body.appendChild(modalWrapper);
        
        // 添加事件监听器
        setTimeout(() => {
            // 关闭按钮
            const closeBtn = document.getElementById('modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    // 在关闭时保存利润率到配方
                    if (profitMarginInput) {
                        const profitMargin = parseFloat(profitMarginInput.value) || 0;
                        const recipe = store.getRecipe(recipeId);
                        if (recipe) {
                            store.updateRecipe(recipeId, { profitMargin: profitMargin });
                        }
                    }
                    document.body.removeChild(modalWrapper);
                });
            }
            
            // 取消按钮
            const cancelBtn = document.getElementById('modal-cancel');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    document.body.removeChild(modalWrapper);
                });
            }
            
            // 确认按钮
            const confirmBtn = document.getElementById('modal-confirm');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', () => {
                    // 在确认时保存利润率到配方
                    if (profitMarginInput) {
                        const profitMargin = parseFloat(profitMarginInput.value) || 0;
                        const recipe = store.getRecipe(recipeId);
                        if (recipe) {
                            store.updateRecipe(recipeId, { profitMargin: profitMargin });
                        }
                    }
                    document.body.removeChild(modalWrapper);
                });
            }
            
            // 利润率和总吨数输入框变化事件
            const profitMarginInput = document.getElementById('profit-margin');
            const totalTonsInput = document.getElementById('total-tons');
            
            // 创建一个统一的计算函数
            const updateCalculations = () => {
                if (totalTonsInput) {
                    const totalTons = parseFloat(totalTonsInput.value) || 1;
                    
                    // 重新计算并显示结果
                    calculateAndDisplay(recipeId, totalTons);
                }
                
                // 更新售价显示
                if (profitMarginInput) {
                    const profitMargin = parseFloat(profitMarginInput.value) || 0;
                    const sellingPrice = cost * (1 + profitMargin);
                    
                    // 更新售价显示元素
                    const sellingPriceValueElements = document.querySelectorAll('.selling-price-value');
                    sellingPriceValueElements.forEach(element => {
                        element.innerHTML = `
                            <div class="text-2xl font-bold text-text">${formatCurrency(sellingPrice)}/kg</div>
                            <div class="text-textMuted text-sm">${formatCurrency(sellingPrice * 1000)}/吨</div>
                        `;
                    });
                    
                    // 更新总利润显示元素
                    const totalProfitValueElements = document.querySelectorAll('.total-profit-value');
                    totalProfitValueElements.forEach(element => {
                        element.innerHTML = `
                            <div class="text-2xl font-bold text-text">${formatCurrency(sellingPrice - cost)}/kg</div>
                            <div class="text-textMuted text-sm">${formatCurrency((sellingPrice - cost) * 1000)}/吨</div>
                        `;
                    });
                }
            };
            
            if (profitMarginInput) {
                // 初始化时计算一次
                updateCalculations();
                
                // 输入框变化时自动计算
                profitMarginInput.addEventListener('input', updateCalculations);
            }
            
            if (totalTonsInput) {
                // 初始化时计算一次
                updateCalculations();
                
                // 输入框变化时自动计算
                totalTonsInput.addEventListener('input', updateCalculations);
            }
            
            // 初始化Lucide图标
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }, 0);
    };

    // 计算并显示结果的函数
    function calculateAndDisplay(recipeId, totalTons) {
        const details = store.calculateRecipeDetails(recipeId, totalTons);
        
        if (details) {
            let resultsHtml = '';
            
            // 基础原料
            if (details.baseMaterials.length > 0) {
                resultsHtml += `
                    <div class="mb-4">
                        <h5 class="font-semibold mb-2">基础原料</h5>
                        <div class="border border-border rounded-lg overflow-hidden">
                            <table class="min-w-full divide-y divide-border">
                                <thead class="bg-surfaceHover">
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">原料名称</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">比例</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">用量(kg)</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">单价</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">成本</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-border">
                                    ${details.baseMaterials.map(mat => `
                                        <tr>
                                            <td class="px-4 py-2 text-sm">${mat.name}</td>
                                            <td class="px-4 py-2 text-sm">${mat.ratio}%</td>
                                            <td class="px-4 py-2 text-sm">${mat.quantity.toFixed(2)}</td>
                                            <td class="px-4 py-2 text-sm">${formatCurrency(mat.unitPrice)}</td>
                                            <td class="px-4 py-2 text-sm">${formatCurrency(mat.cost)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }
            
            // 配色剂
            if (details.colorMaterials.length > 0) {
                resultsHtml += `
                    <div class="mb-4">
                        <h5 class="font-semibold mb-2">配色剂</h5>
                        <div class="border border-border rounded-lg overflow-hidden">
                            <table class="min-w-full divide-y divide-border">
                                <thead class="bg-surfaceHover">
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">原料名称</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">比例</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">用量(kg)</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">单价</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-textMuted uppercase">成本</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-border">
                                    ${details.colorMaterials.map(mat => `
                                        <tr>
                                            <td class="px-4 py-2 text-sm">${mat.name}</td>
                                            <td class="px-4 py-2 text-sm">${mat.ratio}%</td>
                                            <td class="px-4 py-2 text-sm">${mat.quantity.toFixed(2)}</td>
                                            <td class="px-4 py-2 text-sm">${formatCurrency(mat.unitPrice)}</td>
                                            <td class="px-4 py-2 text-sm">${formatCurrency(mat.cost)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }
            
            const resultsContent = document.getElementById('results-content');
            if (resultsContent) {
                resultsContent.innerHTML = resultsHtml;
            }
        }
    }

    window.editRecipe = (recipeId) => {
        // 导航到配方调试页面进行编辑
        window.location.hash = `#recipe-formulation?edit=${recipeId}`;
    };

    window.deleteRecipe = (recipeId) => {
        if (confirm('确定要删除这个配方吗？')) {
            store.deleteRecipe(recipeId);
        }
    };

    return div;
};