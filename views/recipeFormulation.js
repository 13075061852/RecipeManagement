import { store } from '../store.js';
import { formatCurrency } from '../utils.js';

// 配方调试界面
export const renderRecipeFormulation = (state, query) => {
    console.log('Rendering recipe formulation page with query:', query); // 添加调试输出
    
    // 解析查询参数
    let editRecipeId = null;
    if (query) {
        const params = new URLSearchParams(query);
        editRecipeId = params.get('edit');
        console.log('Edit recipe ID:', editRecipeId); // 添加调试输出
    }
    
    const div = document.createElement('div');
    div.className = 'space-y-6 animate-fade-in';

    // 获取所有原料用于选择
    const allIngredients = state.ingredients;
    
    // 按类别分组原料
    const ingredientsByCategory = {};
    allIngredients.forEach(ingredient => {
        if (!ingredientsByCategory[ingredient.category]) {
            ingredientsByCategory[ingredient.category] = [];
        }
        ingredientsByCategory[ingredient.category].push(ingredient);
    });
    
    console.log('Available ingredients:', allIngredients.length); // 添加调试输出

    div.innerHTML = `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">${editRecipeId ? '编辑配方' : '配方调试'}</h2>
            <div class="flex space-x-2">
                <button id="back-to-recipes-btn" class="bg-surface border border-border text-text px-4 py-2 rounded-lg text-sm font-medium hover:bg-surfaceHover transition-colors flex items-center">
                    <i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i> 返回配方中心
                </button>
                <button id="save-recipe-btn" class="bg-primary text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center">
                    <i data-lucide="save" class="w-4 h-4 mr-2"></i> ${editRecipeId ? '更新配方' : '保存配方'}
                </button>
            </div>
        </div>
        
        <div class="bg-gradient-to-r from-primary/5 to-secondary/5 border border-border rounded-xl p-6 mb-6 shadow-sm">
            <h3 class="text-xl font-semibold mb-5 flex items-center">
                <i data-lucide="info" class="w-5 h-5 mr-3 text-primary"></i>
                配方信息
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-5">
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-textMuted">配方名称</label>
                    <input type="text" id="recipe-name" class="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all duration-200" placeholder="请输入配方名称">
                </div>
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-textMuted">配方分类</label>
                    <input type="text" id="recipe-category" class="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all duration-200" placeholder="请输入配方分类">
                </div>
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-textMuted">利润率 %</label>
                    <input type="number" id="profit-margin" step="0.01" min="0" value="0.2" 
                           class="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary text-sm transition-all duration-200">
                </div>
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-textMuted">预估成本 (¥/kg)</label>
                    <div class="p-2.5 bg-background border border-border rounded-lg text-text text-sm font-medium transition-all duration-200">
                        <span id="estimated-cost">0.00</span>
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="block text-xs font-medium text-textMuted">建议售价 (¥/kg)</label>
                    <div class="p-2.5 bg-background border border-border rounded-lg text-text text-sm font-medium transition-all duration-200">
                        <span id="suggested-price">0.00</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <!-- 原料选择面板 -->
            <div class="lg:col-span-1 bg-surface border border-border rounded-xl p-5 flex flex-col" style="height: 600px;">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <i data-lucide="package" class="w-5 h-5 mr-2 text-primary"></i>
                    原料选择
                </h3>
                
                <!-- 一级原料分类tab -->
                <div class="flex flex-wrap border-b border-border mb-2 flex-shrink-0">
                    ${Object.keys(ingredientsByCategory).map((category, index) => {
                        // 计算该分类中被选中的原料数量
                        const categoryIngredients = ingredientsByCategory[category] || [];
                        const selectedCount = categoryIngredients.filter(ingredient => 
                            isIngredientUsed(ingredient.id)
                        ).length;
                        
                        return `
                            <button class="category-tab px-3 py-2 text-sm font-medium ${index === 0 ? 'text-primary border-b-2 border-primary' : 'text-textMuted hover:text-text'} flex items-center relative" 
                                    data-category="${category}">
                                ${category}
                                ${selectedCount > 0 ? `<span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">${selectedCount}</span>` : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
                
                <!-- 二级原料分类tab (仅在选中特定一级分类时显示) -->
                <div class="flex flex-wrap border-b border-border mb-2 flex-shrink-0 secondary-tabs hidden">
                    <!-- 二级tab将通过JavaScript动态生成 -->
                </div>
                
                <!-- 原料列表 -->
                <div class="space-y-4 overflow-y-auto flex-grow">
                    ${Object.entries(ingredientsByCategory).map(([category, ingredients], index) => `
                        <div class="category-content ${index === 0 ? '' : 'hidden'}" data-category="${category}">
                            <div class="p-2 space-y-1">
                                ${ingredients.map(ingredient => `
                                    <div class="ingredient-item flex items-center justify-between p-2 rounded cursor-pointer hover:bg-surfaceHover transition-colors"
                                         data-id="${ingredient.id}" 
                                         data-cost="${ingredient.cost}"
                                         data-name="${ingredient.name}"
                                         data-type="${ingredient.type}">
                                        <span class="text-sm">${ingredient.name}</span>
                                        <span class="text-xs text-textMuted">${formatCurrency(ingredient.cost)}/kg</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- 配方配置区域 -->
            <div class="lg:col-span-2 bg-surface border border-border rounded-xl p-5 flex flex-col" style="height: 600px;">
                <h3 class="text-lg font-semibold mb-4 flex items-center">
                    <i data-lucide="flask-conical" class="w-5 h-5 mr-2 text-primary"></i>
                    <div class="flex items-center gap-4">
                        <span>配方配置</span>
                        <div class="text-sm flex items-center gap-2">
                            <span id="total-ratio" class="font-medium text-primary text-sm">0%</span>
                        </div>
                    </div>
                </h3>
                
                <!-- 模块切换tab -->
                <div class="flex border-b border-border mb-4 flex-shrink-0">
                    <button id="base-tab" class="tab-button px-4 py-2 font-medium text-primary border-b-2 border-primary">
                        基础原料模块
                    </button>
                    <button id="color-tab" class="tab-button px-4 py-2 font-medium text-textMuted hover:text-text">
                        配色模块
                    </button>
                    <div class="flex-grow"></div>
                    <button id="clear-all-btn" class="text-textMuted hover:text-red-500 text-sm flex items-center px-2">
                        <i data-lucide="trash-2" class="w-4 h-4 mr-1"></i>
                        清空
                    </button>
                </div>
                
                <!-- 模块内容区域 -->
                <div class="flex-grow flex flex-col min-h-0">
                    <div id="module-content" class="flex-grow overflow-hidden flex flex-col">
                        <div id="base-module" class="module-content flex-grow flex flex-col min-h-0">
                            <div id="base-ingredients-container" class="space-y-3 overflow-y-auto flex-grow">
                                <!-- 基础原料项将在这里动态添加 -->
                                <div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                    <i data-lucide="package" class="w-12 h-12 mb-3 opacity-50"></i>
                                    <p class="text-center">请选择左侧的原料添加到配方中</p>
                                </div>
                            </div>
                        </div>
                        <div id="color-module" class="module-content hidden flex-grow flex flex-col min-h-0">
                            <div id="color-ingredients-container" class="space-y-3 overflow-y-auto flex-grow">
                                <!-- 配色剂项将在这里动态添加 -->
                                <div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                    <i data-lucide="palette" class="w-12 h-12 mb-3 opacity-50"></i>
                                    <p class="text-center">请选择左侧的原料添加到配方中</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 添加事件监听器的函数
    function attachEventListeners() {
        console.log('Attaching event listeners'); // 添加调试输出
        
        // 确保DOM已经完全渲染后再绑定事件
        setTimeout(() => {
            console.log('DOM should be ready now'); // 添加调试输出
            
            // 保存配方按钮
            const saveRecipeBtn = document.getElementById('save-recipe-btn');
            console.log('Save button element:', saveRecipeBtn); // 添加调试输出
            if (saveRecipeBtn) {
                saveRecipeBtn.addEventListener('click', () => saveRecipe(editRecipeId));
            }
            
            // 返回配方中心按钮
            const backToRecipesBtn = document.getElementById('back-to-recipes-btn');
            if (backToRecipesBtn) {
                backToRecipesBtn.addEventListener('click', () => {
                    // 导航到配方中心页面
                    window.location.hash = '#recipes';
                });
            }

            // Tab切换按钮
            const baseTab = document.getElementById('base-tab');
            const colorTab = document.getElementById('color-tab');
            
            if (baseTab && colorTab) {
                baseTab.addEventListener('click', () => {
                    // 切换tab样式
                    baseTab.className = 'tab-button px-4 py-2 font-medium text-primary border-b-2 border-primary';
                    colorTab.className = 'tab-button px-4 py-2 font-medium text-textMuted hover:text-text';
                    
                    // 切换模块内容显示
                    document.getElementById('base-module').classList.remove('hidden');
                    document.getElementById('color-module').classList.add('hidden');
                });
                
                colorTab.addEventListener('click', () => {
                    // 切换tab样式
                    baseTab.className = 'tab-button px-4 py-2 font-medium text-textMuted hover:text-text';
                    colorTab.className = 'tab-button px-4 py-2 font-medium text-primary border-b-2 border-primary';
                    
                    // 切换模块内容显示
                    document.getElementById('base-module').classList.add('hidden');
                    document.getElementById('color-module').classList.remove('hidden');
                });
            }
            
            // 清空按钮
            const clearAllBtn = document.getElementById('clear-all-btn');
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => {
                    // 获取当前激活的模块
                    const activeModule = document.querySelector('.module-content:not(.hidden)');
                    if (activeModule) {
                        const moduleId = activeModule.id;
                        let containerId;
                        
                        if (moduleId === 'base-module') {
                            containerId = 'base-ingredients-container';
                        } else {
                            containerId = 'color-ingredients-container';
                        }
                        
                        const container = document.getElementById(containerId);
                        if (container) {
                            // 获取所有要删除的原料ID
                            const ingredientIds = [];
                            container.querySelectorAll('.ingredient-id').forEach(hiddenId => {
                                if (hiddenId.value) {
                                    ingredientIds.push(hiddenId.value);
                                }
                            });
                            
                            // 清空容器
                            container.innerHTML = '';
                            
                            // 重新添加空状态提示
                            const emptyStateHtml = moduleId === 'base-module' ? 
                                `<div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                    <i data-lucide="package" class="w-12 h-12 mb-3 opacity-50"></i>
                                    <p class="text-center">请选择左侧的原料添加到配方中</p>
                                </div>` :
                                `<div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                    <i data-lucide="palette" class="w-12 h-12 mb-3 opacity-50"></i>
                                    <p class="text-center">请选择左侧的原料添加到配方中</p>
                                </div>`;
                            container.innerHTML = emptyStateHtml;
                            
                            // 重新初始化Lucide图标
                            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                                lucide.createIcons();
                            }
                            
                            // 更新统计数据
                            updateStatistics();
                            
                            // 更新左侧原料选择面板的标注状态
                            ingredientIds.forEach(id => {
                                updateIngredientSelectionStatus(id);
                            });
                        }
                    }
                });
            }

            // 原料分类tab切换
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    const category = this.dataset.category;
                    
                    // 切换tab样式
                    document.querySelectorAll('.category-tab').forEach(t => {
                        if (t.dataset.category === category) {
                            t.className = 'category-tab px-3 py-2 text-sm font-medium text-primary border-b-2 border-primary flex items-center relative';
                        } else {
                            t.className = 'category-tab px-3 py-2 text-sm font-medium text-textMuted hover:text-text flex items-center relative';
                        }
                    });
                    
                    // 切换内容显示
                    document.querySelectorAll('.category-content').forEach(content => {
                        if (content.dataset.category === category) {
                            content.classList.remove('hidden');
                        } else {
                            content.classList.add('hidden');
                        }
                    });
                    
                    // 更新二级tab
                    updateSecondaryTabs(category);
                });
            });
            
            // 二级原料分类tab切换
            document.querySelector('.secondary-tabs').addEventListener('click', function(e) {
                if (e.target.classList.contains('secondary-tab')) {
                    const subCategory = e.target.dataset.subcategory;
                    const mainCategory = document.querySelector('.category-tab.text-primary').dataset.category;
                    
                    // 切换二级tab样式
                    document.querySelectorAll('.secondary-tab').forEach(t => {
                        if (t.dataset.subcategory === subCategory) {
                            t.className = 'secondary-tab px-3 py-2 text-xs font-medium text-primary border-b-2 border-primary flex items-center relative';
                        } else {
                            t.className = 'secondary-tab px-3 py-2 text-xs font-medium text-textMuted hover:text-text flex items-center relative';
                        }
                    });
                    
                    // 筛选显示原料
                    filterIngredientsBySubCategory(mainCategory, subCategory);
                }
            });
            
            // 利润率输入框变化事件
            const profitMarginInput = document.getElementById('profit-margin');
            console.log('Profit margin input:', profitMarginInput); // 添加调试输出
            if (profitMarginInput) {
                profitMarginInput.addEventListener('input', updateStatistics);
            }
            
            // 原料选择事件
            document.querySelectorAll('.ingredient-item').forEach(item => {
                item.addEventListener('click', function() {
                    const ingredientId = this.dataset.id;
                    const ingredientName = this.dataset.name;
                    const ingredientCost = this.dataset.cost;
                    
                    // 检查该原料是否已经被选中
                    if (this.classList.contains('bg-blue-50')) {
                        // 如果已选中，则取消选择（从配方中移除）
                        removeIngredientFromModules(ingredientId);
                        updateIngredientSelectionStatus(ingredientId);
                        return;
                    }
                    
                    // 获取当前激活的模块
                    const activeModule = document.querySelector('.module-content:not(.hidden)');
                    const moduleId = activeModule ? activeModule.id : null;
                    
                    if (moduleId) {
                        let containerId, moduleType;
                        if (moduleId === 'base-module') {
                            containerId = 'base-ingredients-container';
                            moduleType = 'base';
                        } else {
                            containerId = 'color-ingredients-container';
                            moduleType = 'color';
                        }
                        
                        const container = document.getElementById(containerId);
                        if (container) {
                            // 检查是否已存在相同的原料
                            let ingredientExists = false;
                            container.querySelectorAll('.ingredient-id').forEach(hiddenId => {
                                if (hiddenId.value === ingredientId) {
                                    ingredientExists = true;
                                }
                            });
                            
                            if (!ingredientExists) {
                                // 添加新原料项
                                addIngredientToSpecificModule(moduleType, ingredientId, ingredientName, ingredientCost);
                            }
                        }
                    }
                });
                
                // 鼠标悬停效果
                item.addEventListener('mouseenter', function() {
                    this.classList.add('hover:bg-surfaceHover');
                });
                
                item.addEventListener('mouseleave', function() {
                    // 只有在未选中的情况下才移除悬停效果
                    if (!this.classList.contains('bg-blue-50')) {
                        this.classList.remove('hover:bg-surfaceHover');
                    }
                });
            });
        }, 0);
    }

    // 从所有模块中移除指定原料
    function removeIngredientFromModules(ingredientId) {
        // 查找并移除基础原料模块中的原料
        document.querySelectorAll('#base-ingredients-container .ingredient-id').forEach(hiddenId => {
            if (hiddenId.value === ingredientId) {
                const itemElement = hiddenId.closest('[id]');
                if (itemElement) {
                    const container = document.getElementById('base-ingredients-container');
                    itemElement.remove();
                    updateStatistics();
                    
                    // 如果容器为空，重新添加空状态提示
                    if (container && container.children.length === 0) {
                        const emptyStateHtml = 
                            `<div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                <i data-lucide="package" class="w-12 h-12 mb-3 opacity-50"></i>
                                <p class="text-center">请选择左侧的原料添加到配方中</p>
                            </div>`;
                        container.innerHTML = emptyStateHtml;
                        
                        // 重新初始化Lucide图标
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                            lucide.createIcons();
                        }
                    }
                }
            }
        });
        
        // 查找并移除配色模块中的原料
        document.querySelectorAll('#color-ingredients-container .ingredient-id').forEach(hiddenId => {
            if (hiddenId.value === ingredientId) {
                const itemElement = hiddenId.closest('[id]');
                if (itemElement) {
                    const container = document.getElementById('color-ingredients-container');
                    itemElement.remove();
                    updateStatistics();
                    
                    // 如果容器为空，重新添加空状态提示
                    if (container && container.children.length === 0) {
                        const emptyStateHtml = 
                            `<div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                <i data-lucide="palette" class="w-12 h-12 mb-3 opacity-50"></i>
                                <p class="text-center">请选择左侧的原料添加到配方中</p>
                            </div>`;
                        container.innerHTML = emptyStateHtml;
                        
                        // 重新初始化Lucide图标
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                            lucide.createIcons();
                        }
                    }
                }
            }
        });
        
        // 更新分类tab上的选中数量
        updateCategoryTabCounts();
    }

    // 添加原料到指定模块
    function addIngredientToModule(moduleType) {
        console.log('Adding ingredient to module:', moduleType); // 添加调试输出
        
        const containerId = moduleType === 'base' ? 'base-ingredients-container' : 'color-ingredients-container';
        const container = document.getElementById(containerId);
        
        console.log('Container element:', container); // 添加调试输出
        
        if (!container) {
            console.error('Container not found for module:', moduleType);
            return;
        }
        
        addIngredientToSpecificModule(moduleType);
    }
    
    // 添加原料到特定模块
    function addIngredientToSpecificModule(moduleType, ingredientId = null, ingredientName = null, ingredientCost = null) {
        const containerId = moduleType === 'base' ? 'base-ingredients-container' : 'color-ingredients-container';
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error('Container not found for module:', moduleType);
            return;
        }
        
        // 移除空状态提示
        const emptyState = container.querySelector('.empty-state');
        if (emptyState) {
            container.removeChild(emptyState);
        }
        
        const itemId = `${moduleType}-item-${Date.now()}`;
        
        const itemHtml = `
            <div id="${itemId}" class="flex items-center space-x-2 p-3 border border-border rounded-lg bg-background hover:bg-surfaceHover transition-colors">
                <div class="flex-1 min-w-0">
                    <div class="ingredient-display flex items-center justify-between p-2 border border-border rounded cursor-pointer bg-surface w-full"
                         data-module="${moduleType}" data-item="${itemId}">
                        <span class="text-sm ${ingredientName ? 'text-text' : 'text-textMuted'}">${ingredientName || '请选择原料'}</span>
                        ${ingredientName ? `<span class="text-xs text-textMuted">${formatCurrency(ingredientCost)}/kg</span>` : ''}
                    </div>
                    <input type="hidden" class="ingredient-id" value="${ingredientId || ''}">
                    <input type="hidden" class="ingredient-cost" value="${ingredientCost || '0'}">
                </div>
                <div class="flex items-center">
                    <input type="number" class="ratio-input w-16 px-2 py-1.5 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="%" min="0" step="0.1" value="0">
                </div>
                <button class="remove-item text-red-500 hover:text-red-700 p-1">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', itemHtml);
        
        // 重新初始化Lucide图标
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        
        // 绑定事件
        const itemElement = document.getElementById(itemId);
        console.log('Item element created:', itemElement); // 添加调试输出
        
        if (itemElement) {
            const ingredientDisplay = itemElement.querySelector('.ingredient-display');
            const ratioInput = itemElement.querySelector('.ratio-input');
            const removeBtn = itemElement.querySelector('.remove-item');
            
            // 点击已选择的原料进行删除
            if (ingredientDisplay && ingredientId) {
                ingredientDisplay.addEventListener('click', () => {
                    // 获取被删除原料的ID
                    const deletedIngredientId = ingredientId;
                    
                    itemElement.remove();
                    updateStatistics();
                    
                    // 如果容器为空，重新添加空状态提示
                    if (container.children.length === 0) {
                        const emptyStateHtml = moduleType === 'base' ? 
                            `<div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                <i data-lucide="package" class="w-12 h-12 mb-3 opacity-50"></i>
                                <p class="text-center">请选择左侧的原料添加到配方中</p>
                            </div>` :
                            `<div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                <i data-lucide="palette" class="w-12 h-12 mb-3 opacity-50"></i>
                                <p class="text-center">请选择左侧的原料添加到配方中</p>
                            </div>`;
                        container.innerHTML = emptyStateHtml;
                        
                        // 重新初始化Lucide图标
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                            lucide.createIcons();
                        }
                    }
                    
                    // 更新左侧原料选择面板的标注状态
                    if (deletedIngredientId) {
                        updateIngredientSelectionStatus(deletedIngredientId);
                    }
                });
            }
            
            if (ratioInput) {
                ratioInput.addEventListener('input', updateStatistics);
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    // 获取被删除原料的ID
                    const hiddenId = itemElement.querySelector('.ingredient-id');
                    const deletedIngredientId = hiddenId ? hiddenId.value : null;
                    
                    itemElement.remove();
                    updateStatistics();
                    
                    // 如果容器为空，重新添加空状态提示
                    if (container.children.length === 0) {
                        const emptyStateHtml = moduleType === 'base' ? 
                            `<div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                <i data-lucide="package" class="w-12 h-12 mb-3 opacity-50"></i>
                                <p class="text-center">请选择左侧的原料添加到配方中</p>
                            </div>` :
                            `<div class="empty-state flex flex-col items-center justify-center h-full text-textMuted">
                                <i data-lucide="palette" class="w-12 h-12 mb-3 opacity-50"></i>
                                <p class="text-center">请选择左侧的原料添加到配方中</p>
                            </div>`;
                        container.innerHTML = emptyStateHtml;
                        
                        // 重新初始化Lucide图标
                        if (typeof lucide !== 'undefined' && lucide.createIcons) {
                            lucide.createIcons();
                        }
                    }
                    
                    // 更新左侧原料选择面板的标注状态
                    if (deletedIngredientId) {
                        updateIngredientSelectionStatus(deletedIngredientId);
                    }
                });
            }
        }
        
        updateStatistics();
        
        // 更新左侧原料选择面板的标注状态
        if (ingredientId) {
            updateIngredientSelectionStatus(ingredientId);
        }
    }

    // 更新原料选择状态
    function updateIngredientSelectionStatus(ingredientId) {
        // 检查该原料是否还在任何模块中使用
        const isUsed = isIngredientUsed(ingredientId);
        
        // 更新左侧原料选择面板中的显示状态
        const ingredientItem = document.querySelector(`.ingredient-item[data-id="${ingredientId}"]`);
        if (ingredientItem) {
            if (isUsed) {
                ingredientItem.classList.add('bg-blue-50', 'border-l-4', 'border-l-blue-500');
                ingredientItem.classList.remove('hover:bg-surfaceHover');
            } else {
                ingredientItem.classList.remove('bg-blue-50', 'border-l-4', 'border-l-blue-500');
                ingredientItem.classList.add('hover:bg-surfaceHover');
            }
        }
        
        // 更新分类tab上的选中数量
        updateCategoryTabCounts();
    }

    // 更新分类tab上的选中数量
    function updateCategoryTabCounts() {
        // 获取所有原料分类
        const categories = Object.keys(ingredientsByCategory);
        
        categories.forEach(category => {
            // 计算该分类中被选中的原料数量
            const categoryIngredients = ingredientsByCategory[category] || [];
            const selectedCount = categoryIngredients.filter(ingredient => 
                isIngredientUsed(ingredient.id)
            ).length;
            
            // 更新对应tab上的数字
            const tab = document.querySelector(`.category-tab[data-category="${category}"]`);
            if (tab) {
                // 移除现有的数字标记
                const existingBadge = tab.querySelector('.rounded-full');
                if (existingBadge) {
                    existingBadge.remove();
                }
                
                // 如果有选中的原料，添加新的数字标记
                if (selectedCount > 0) {
                    const badge = document.createElement('span');
                    badge.className = 'absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center';
                    badge.textContent = selectedCount;
                    tab.appendChild(badge);
                }
            }
        });
    }

    // 检查原料是否在任何模块中使用
    function isIngredientUsed(ingredientId) {
        // 检查基础原料模块
        const baseIngredients = document.querySelectorAll('#base-ingredients-container .ingredient-id');
        for (let i = 0; i < baseIngredients.length; i++) {
            if (baseIngredients[i].value === ingredientId) {
                return true;
            }
        }
        
        // 检查配色模块
        const colorIngredients = document.querySelectorAll('#color-ingredients-container .ingredient-id');
        for (let i = 0; i < colorIngredients.length; i++) {
            if (colorIngredients[i].value === ingredientId) {
                return true;
            }
        }
        
        return false;
    }

    // 更新配方统计数据
    function updateStatistics() {
        console.log('Updating statistics'); // 添加调试输出
        
        // 计算总比例
        let totalRatio = 0;
        let totalCost = 0;
        
        // 计算基础原料总比例和成本
        document.querySelectorAll('#base-ingredients-container .flex.items-center').forEach(item => {
            const hiddenId = item.querySelector('.ingredient-id');
            const hiddenCost = item.querySelector('.ingredient-cost');
            const ratioInput = item.querySelector('.ratio-input');
            
            if (hiddenId && hiddenId.value && hiddenCost && ratioInput && ratioInput.value) {
                const ratio = parseFloat(ratioInput.value) || 0;
                totalRatio += ratio;
                
                const cost = parseFloat(hiddenCost.value) || 0;
                console.log('Base ingredient ID:', hiddenId.value, 'Ratio:', ratio, 'Cost:', cost); // 添加调试输出
                totalCost += cost * (ratio / 100);
            }
        });
        
        // 计算配色剂总比例和成本
        document.querySelectorAll('#color-ingredients-container .flex.items-center').forEach(item => {
            const hiddenId = item.querySelector('.ingredient-id');
            const hiddenCost = item.querySelector('.ingredient-cost');
            const ratioInput = item.querySelector('.ratio-input');
            
            if (hiddenId && hiddenId.value && hiddenCost && ratioInput && ratioInput.value) {
                const ratio = parseFloat(ratioInput.value) || 0;
                totalRatio += ratio;
                
                const cost = parseFloat(hiddenCost.value) || 0;
                console.log('Color ingredient ID:', hiddenId.value, 'Ratio:', ratio, 'Cost:', cost); // 添加调试输出
                totalCost += cost * (ratio / 100);
            }
        });
        
        console.log('Total ratio:', totalRatio, 'Total cost:', totalCost); // 添加调试输出
        
        // 更新显示
        const totalRatioElement = document.getElementById('total-ratio');
        const estimatedCostElement = document.getElementById('estimated-cost');
        const suggestedPriceElement = document.getElementById('suggested-price');
        const profitMarginElement = document.getElementById('profit-margin');
        
        if (totalRatioElement) {
            totalRatioElement.textContent = `${totalRatio.toFixed(1)}%`;
        }
        
        if (estimatedCostElement) {
            estimatedCostElement.textContent = `${formatCurrency(totalCost)}/kg`;
        }
        
        if (suggestedPriceElement && profitMarginElement) {
            const profitMargin = parseFloat(profitMarginElement.value) || 0;
            const suggestedPrice = totalCost * (1 + profitMargin);
            suggestedPriceElement.textContent = `${formatCurrency(suggestedPrice)}/kg`;
        }
        
        // 根据总比例改变颜色
        if (totalRatioElement) {
            if (Math.abs(totalRatio - 100) < 0.1) {
                totalRatioElement.className = 'text-2xl font-bold text-green-500';
            } else {
                totalRatioElement.className = 'text-2xl font-bold text-primary';
            }
        }
    }

    // 保存配方
    function saveRecipe(recipeId) {
        console.log('Saving recipe, ID:', recipeId); // 添加调试输出
        
        const recipeNameInput = document.getElementById('recipe-name');
        const recipeCategorySelect = document.getElementById('recipe-category');
        const profitMarginInput = document.getElementById('profit-margin');
        
        if (!recipeNameInput || !recipeCategorySelect || !profitMarginInput) {
            console.error('Required form elements not found');
            return;
        }
        
        const recipeName = recipeNameInput.value.trim();
        const recipeCategory = recipeCategorySelect.value;
        const profitMargin = parseFloat(profitMarginInput.value) || 0;
        
        console.log('Recipe name:', recipeName, 'Category:', recipeCategory, 'Profit margin:', profitMargin); // 添加调试输出
        
        if (!recipeName) {
            alert('请输入配方名称');
            return;
        }
        
        // 收集基础原料
        const baseIngredients = [];
        document.querySelectorAll('#base-ingredients-container .flex.items-center').forEach(item => {
            const hiddenId = item.querySelector('.ingredient-id');
            const ratioInput = item.querySelector('.ratio-input');
            
            if (hiddenId && hiddenId.value && ratioInput && ratioInput.value) {
                baseIngredients.push({
                    id: hiddenId.value,
                    ratio: parseFloat(ratioInput.value) || 0
                });
            }
        });
        
        console.log('Base ingredients:', baseIngredients); // 添加调试输出
        
        // 收集配色剂
        const colorIngredients = [];
        document.querySelectorAll('#color-ingredients-container .flex.items-center').forEach(item => {
            const hiddenId = item.querySelector('.ingredient-id');
            const ratioInput = item.querySelector('.ratio-input');
            
            if (hiddenId && hiddenId.value && ratioInput && ratioInput.value) {
                colorIngredients.push({
                    id: hiddenId.value,
                    ratio: parseFloat(ratioInput.value) || 0
                });
            }
        });
        
        console.log('Color ingredients:', colorIngredients); // 添加调试输出
        
        // 验证总比例
        let totalRatio = 0;
        [...baseIngredients, ...colorIngredients].forEach(item => {
            totalRatio += item.ratio;
        });
        
        console.log('Total ratio:', totalRatio); // 添加调试输出
        
        // 如果总比例与100%相差很小(小于0.001%)，自动调整最后一项使总和为100%
        if (Math.abs(totalRatio - 100) > 0.001) {
            alert(`总比例必须为100%，当前为${totalRatio.toFixed(1)}%`);
            return;
        } else if (Math.abs(totalRatio - 100) > 0.000001) {
            // 自动调整最后一项
            const allIngredients = [...baseIngredients, ...colorIngredients];
            if (allIngredients.length > 0) {
                const lastIngredient = allIngredients[allIngredients.length - 1];
                const adjustment = 100 - totalRatio;
                lastIngredient.ratio += adjustment;
                
                // 确保调整后的比例不会变成负数
                if (lastIngredient.ratio < 0) {
                    lastIngredient.ratio = 0;
                    // 如果调整后最后一项为负数，则不允许保存
                    alert(`无法自动调整比例，请手动调整使总和为100%`);
                    return;
                }
                
                console.log(`Auto-adjusted last ingredient by ${adjustment}, new ratio: ${lastIngredient.ratio}`);
            }
        }
        
        if (recipeId) {
            // 更新现有配方
            const recipeData = {
                name: recipeName,
                category: recipeCategory,
                profitMargin: profitMargin,
                modules: {
                    base: {
                        name: '基础原料',
                        ingredients: baseIngredients
                    },
                    color: {
                        name: '配色模块',
                        ingredients: colorIngredients
                    }
                }
            };
            
            console.log('Updating recipe with data:', recipeData); // 添加调试输出
            store.updateRecipe(recipeId, recipeData);
            // 显示成功提示并跳转到首页
            showSuccessMessage('配方更新成功！');
            window.location.hash = '#recipes';
        } else {
            // 创建新配方
            const recipe = {
                id: 'recipe_' + Date.now(),
                name: recipeName,
                category: recipeCategory,
                yield: 1000, // 默认产量1000kg
                unit: 'kg',
                sellingPricePerKg: 0, // 将在保存时计算
                profitMargin: profitMargin,
                modules: {
                    base: {
                        name: '基础原料',
                        ingredients: baseIngredients
                    },
                    color: {
                        name: '配色模块',
                        ingredients: colorIngredients
                    }
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            console.log('Recipe object:', recipe); // 添加调试输出
            
            // 保存到store
            store.addRecipe(recipe);
            // 显示成功提示并跳转到首页
            showSuccessMessage('配方保存成功！');
            window.location.hash = '#recipes';
        }
        
        // 重置表单
        recipeNameInput.value = '';
        document.getElementById('base-ingredients-container').innerHTML = '';
        document.getElementById('color-ingredients-container').innerHTML = '';
        profitMarginInput.value = '0.2';
        
        // 重新添加初始项
        addIngredientToModule('base');
    }

    // 在DOM渲染完成后附加事件监听器
    setTimeout(() => {
        console.log('Page rendering complete, attaching event listeners'); // 添加调试输出
            
        // 如果是编辑模式，加载配方数据
        if (editRecipeId) {
            console.log('Loading recipe data for edit mode'); // 添加调试输出
            const recipe = store.getRecipe(editRecipeId);
            if (recipe) {
                console.log('Recipe data:', recipe); // 添加调试输出
                
                // 填充表单数据
                const recipeNameInput = document.getElementById('recipe-name');
                const recipeCategorySelect = document.getElementById('recipe-category');
                const profitMarginInput = document.getElementById('profit-margin');
                
                if (recipeNameInput) recipeNameInput.value = recipe.name;
                if (recipeCategorySelect) recipeCategorySelect.value = recipe.category;
                if (profitMarginInput) profitMarginInput.value = recipe.profitMargin || '0.2';
                
                // 清空现有的原料容器
                const baseContainer = document.getElementById('base-ingredients-container');
                const colorContainer = document.getElementById('color-ingredients-container');
                if (baseContainer) baseContainer.innerHTML = '';
                if (colorContainer) colorContainer.innerHTML = '';
                
                // 添加基础原料
                if (recipe.modules && recipe.modules.base && recipe.modules.base.ingredients) {
                    // 使用递归函数确保按顺序添加配料
                    function addBaseIngredient(index) {
                        if (index >= recipe.modules.base.ingredients.length) {
                            // 所有基础原料添加完成，更新统计数据
                            setTimeout(() => {
                                updateStatistics();
                            }, 50);
                            return;
                        }
                        
                        const ingredient = recipe.modules.base.ingredients[index];
                        const ingredientData = allIngredients.find(i => i.id === ingredient.id);
                        if (ingredientData) {
                            addIngredientToSpecificModule('base', ingredient.id, ingredientData.name, ingredientData.cost);
                            
                            // 等待DOM更新后填充比例值
                            setTimeout(() => {
                                // 使用更精确的方法选择刚添加的元素
                                const container = document.getElementById('base-ingredients-container');
                                const items = container.querySelectorAll('.flex.items-center');
                                const currentItem = items[items.length - 1]; // 选择最后一个添加的元素
                                
                                console.log(`Base item ${index}: total items = ${items.length}, selecting item at index ${items.length - 1}`);
                                
                                if (currentItem) {
                                    const ratioInput = currentItem.querySelector('.ratio-input');
                                    if (ratioInput) {
                                        console.log(`Setting base ingredient ${ingredient.id} ratio to ${ingredient.ratio}`);
                                        ratioInput.value = ingredient.ratio;
                                        
                                        // 添加输入事件监听器以确保统计数据更新
                                        ratioInput.addEventListener('input', updateStatistics);
                                    }
                                } else {
                                    console.log(`Base item ${index} not found`);
                                }
                                
                                // 继续添加下一个配料
                                addBaseIngredient(index + 1);
                            }, 30);
                        } else {
                            // 继续添加下一个配料
                            addBaseIngredient(index + 1);
                        }
                    }
                    
                    // 开始添加基础原料
                    addBaseIngredient(0);
                }
                
                // 添加配色剂
                if (recipe.modules && recipe.modules.color && recipe.modules.color.ingredients) {
                    // 使用递归函数确保按顺序添加配料
                    function addColorIngredient(index) {
                        if (index >= recipe.modules.color.ingredients.length) {
                            // 所有配色剂添加完成，更新统计数据
                            setTimeout(() => {
                                updateStatistics();
                            }, 50);
                            return;
                        }
                        
                        const ingredient = recipe.modules.color.ingredients[index];
                        const ingredientData = allIngredients.find(i => i.id === ingredient.id);
                        if (ingredientData) {
                            addIngredientToSpecificModule('color', ingredient.id, ingredientData.name, ingredientData.cost);
                            
                            // 等待DOM更新后填充比例值
                            setTimeout(() => {
                                // 使用更精确的方法选择刚添加的元素
                                const container = document.getElementById('color-ingredients-container');
                                const items = container.querySelectorAll('.flex.items-center');
                                const currentItem = items[items.length - 1]; // 选择最后一个添加的元素
                                
                                console.log(`Color item ${index}: total items = ${items.length}, selecting item at index ${items.length - 1}`);
                                
                                if (currentItem) {
                                    const ratioInput = currentItem.querySelector('.ratio-input');
                                    if (ratioInput) {
                                        console.log(`Setting color ingredient ${ingredient.id} ratio to ${ingredient.ratio}`);
                                        ratioInput.value = ingredient.ratio;
                                        
                                        // 添加输入事件监听器以确保统计数据更新
                                        ratioInput.addEventListener('input', updateStatistics);
                                    }
                                } else {
                                    console.log(`Color item ${index} not found`);
                                }
                                
                                // 继续添加下一个配料
                                addColorIngredient(index + 1);
                            }, 30);
                        } else {
                            // 继续添加下一个配料
                            addColorIngredient(index + 1);
                        }
                    }
                    
                    // 开始添加配色剂
                    addColorIngredient(0);
                }
            }
        }
        
        attachEventListeners();
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }, 0);

    console.log('Recipe formulation page rendered, returning div'); // 添加调试输出
    return div;
};

// 显示成功消息
function showSuccessMessage(message) {
    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    messageElement.textContent = message;
    messageElement.style.transition = 'opacity 0.3s ease-in-out';
    
    // 添加到页面
    document.body.appendChild(messageElement);
    
    // 2秒后自动消失
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 2000);
}

// 更新二级tab
function updateSecondaryTabs(mainCategory) {
    const secondaryTabsContainer = document.querySelector('.secondary-tabs');
    if (!secondaryTabsContainer) return;
    
    // 清空二级tab
    secondaryTabsContainer.innerHTML = '';
    
    // 定义二级分类映射
    const subCategories = {
        '增塑剂 (Plasticizers)': ['通用型', '环保型', '耐寒型', '高性能环保型', '无毒增塑剂'],
        '阻燃剂 (Flame Retardants)': ['卤系阻燃剂', '磷系阻燃剂', '无机填充型', '协效阻燃剂', '无卤阻燃剂', '氯化石蜡类'],
        '抗氧剂 (Antioxidants)': ['受阻酚类', '酚类抗氧剂', '复合型抗氧剂', '亚磷酸酯类'],
        '填充增强剂 (Fillers/Reinforcements)': ['增强材料', '无机填料', '天然矿物填料', '惰性填料', '纳米填料', '纳米层状填料'],
        '抗冲改性剂 (Impact Modifiers)': ['弹性体', '核壳结构', '热塑性弹性体'],
        '光稳定剂 (Light Stabilizers)': ['二苯甲酮类', '受阻胺类', '苯并三唑类', '高分子量受阻胺类', '液体受阻胺类', '聚合型受阻胺类'],
        '着色剂 (Colorants)': ['有机颜料', '无机颜料', '光学增白剂'],
        '润滑剂 (Lubricants)': ['金属皂类', '聚合物蜡', '酰胺类', '矿物蜡'],
        '发泡剂 (Foaming Agents)': ['化学发泡剂', '无机发泡剂', '物理发泡剂', '复合化学发泡剂'],
        '抗菌剂 (Antimicrobial Agents)': ['无机抗菌剂', '有机抗菌剂', '载银抗菌剂'],
        '抗静电剂 (Antistatic Agents)': ['阳离子型', '非离子型', '阴离子型', '永久型']
    };
    
    // 获取当前主分类的二级分类
    const subCats = subCategories[mainCategory];
    
    if (subCats && subCats.length > 0) {
        // 生成二级tab HTML
        let tabsHtml = '';
        subCats.forEach((subCat, index) => {
            tabsHtml += `
                <button class="secondary-tab px-3 py-2 text-xs font-medium ${index === 0 ? 'text-primary border-b-2 border-primary' : 'text-textMuted hover:text-text'} flex items-center relative" 
                        data-subcategory="${subCat}">
                    ${subCat}
                </button>
            `;
        });
        
        secondaryTabsContainer.innerHTML = tabsHtml;
        secondaryTabsContainer.classList.remove('hidden');
    } else {
        secondaryTabsContainer.classList.add('hidden');
    }
}

// 根据二级分类筛选原料
function filterIngredientsBySubCategory(mainCategory, subCategory) {
    // 获取当前分类的内容区域
    const categoryContent = document.querySelector(`.category-content[data-category="${mainCategory}"]`);
    if (!categoryContent) return;
    
    // 获取该分类下的所有原料项
    const ingredientItems = categoryContent.querySelectorAll('.ingredient-item');
    
    // 根据二级分类筛选显示
    ingredientItems.forEach(item => {
        const ingredientType = item.dataset.type || '';
        
        if (subCategory === '全部' || ingredientType === subCategory) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}