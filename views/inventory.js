import { Table, Badge, Modal, SmallModal } from '../components.js';
import { store } from '../store.js';
import { formatCurrency, formatDate } from '../utils.js';
import { categories } from '../data.js';

export const renderInventory = (state) => {
    const div = document.createElement('div');
    div.className = 'h-full flex flex-col animate-fade-in';

    // 获取所有唯一的分类
    const categories = [...new Set(state.ingredients.map(item => item.category))];

    // 创建分类过滤状态变量，从URL参数或本地存储中获取当前分类
    let activeCategory = 'all';
    
    // 尝试从URL参数获取当前分类
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && (categoryParam === 'all' || categories.includes(categoryParam))) {
        activeCategory = categoryParam;
    }

    const headers = ['原料名称', '分类', '当前库存', '单位成本', '库存状态', '操作'];

    const renderRow = (item, index) => {
        switch (index) {
            case 0: return `<span class="font-medium text-text">${item.name}</span>`;
            case 1: return `<span class="text-textMuted text-xs uppercase border border-border px-2 py-0.5 rounded bg-surface">${item.category}</span>`;
            case 2: return `<span class="${item.stock <= item.minStock ? 'text-red-500 font-bold' : ''}">${item.stock} ${item.unit}</span>`;
            case 3: return formatCurrency(item.cost);
            case 4: return item.stock <= item.minStock ? Badge('low_stock') : '<span class="text-green-500 text-xs flex items-center"><i data-lucide="check-circle" class="w-3 h-3 mr-1"></i> 正常</span>';
            case 5: return `
                <div class="flex space-x-2">
                    <button class="text-primary hover:text-primaryHover" onclick="editIngredient('${item.id}')">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button class="text-green-500 hover:text-green-600" onclick="recordStockChange('${item.id}', 'in')">
                        <i data-lucide="trending-up" class="w-4 h-4"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-600" onclick="recordStockChange('${item.id}', 'out')">
                        <i data-lucide="trending-down" class="w-4 h-4"></i>
                    </button>
                    <button class="text-blue-500 hover:text-blue-600" onclick="showStockHistory('${item.id}')">
                        <i data-lucide="history" class="w-4 h-4"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-600" onclick="deleteIngredient('${item.id}')">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            default: return '';
        }
    };

    // 根据活动分类过滤化学品
    const getFilteredIngredients = () => {
        if (activeCategory === 'all') {
            return state.ingredients;
        }
        return state.ingredients.filter(item => item.category === activeCategory);
    };

    // 渲染分类标签
    const renderCategoryTabs = () => {
        return `
            <div class="flex flex-wrap gap-2 mb-6">
                <button class="category-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-primary text-background' : 'bg-surface hover:bg-surfaceHover text-text'}" 
                        data-category="all">
                    全部 (${state.ingredients.length})
                </button>
                ${categories.map(category => {
                    const count = state.ingredients.filter(item => item.category === category).length;
                    return `
                        <button class="category-tab px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category ? 'bg-primary text-background' : 'bg-surface hover:bg-surfaceHover text-text'}" 
                                data-category="${category}">
                            ${category} (${count})
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    };

    // 添加编辑原料的函数到全局作用域
    window.editIngredient = function(id) {
        const ingredient = store.getIngredient(id);
        if (!ingredient) return;
        
        const modalContent = `
            <div class="space-y-4">
                <div class="grid grid-cols-1 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-textMuted mb-1">化学品名称</label>
                        <input type="text" id="edit-name" value="${ingredient.name}" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-textMuted mb-1">分类</label>
                        <input type="text" id="edit-category" value="${ingredient.category}" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-textMuted mb-1">当前库存</label>
                            <input type="number" id="edit-stock" value="${ingredient.stock}" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-textMuted mb-1">单位</label>
                            <input type="text" id="edit-unit" value="${ingredient.unit}" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-textMuted mb-1">单位成本 (¥)</label>
                            <input type="number" step="0.01" id="edit-cost" value="${ingredient.cost}" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-textMuted mb-1">最低库存</label>
                            <input type="number" id="edit-minStock" value="${ingredient.minStock}" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        showCustomSmallModal('编辑化学品', modalContent, '保存更改', () => {
            const updatedData = {
                name: document.getElementById('edit-name').value,
                category: document.getElementById('edit-category').value,
                stock: parseFloat(document.getElementById('edit-stock').value),
                unit: document.getElementById('edit-unit').value,
                cost: parseFloat(document.getElementById('edit-cost').value),
                minStock: parseFloat(document.getElementById('edit-minStock').value)
            };
            
            store.updateIngredient(id, updatedData);
            hideModal();
            // 显示成功通知
            showNotification('更改成功', 'success');
        });
    };

    // 添加删除原料的函数到全局作用域
    window.deleteIngredient = function(id) {
        if (confirm('确定要删除这个化学品吗？')) {
            store.deleteIngredient(id);
            // 显示成功通知
            showNotification('化学品已删除', 'success');
            // 重新渲染视图以反映更改
            renderInventoryView();
        }
    };

    // 添加显示添加原料模态框的函数到全局作用域
    window.showAddIngredientModal = function() {
        const modalContent = `
            <div class="space-y-4">
                <div class="grid grid-cols-1 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-textMuted mb-1">化学品名称</label>
                        <input type="text" id="add-name" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入化学品名称">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-textMuted mb-1">分类</label>
                        <input type="text" id="add-category" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入分类">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-textMuted mb-1">初始库存</label>
                            <input type="number" id="add-stock" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入数量">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-textMuted mb-1">单位</label>
                            <input type="text" id="add-unit" value="kg" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-textMuted mb-1">单位成本 (¥)</label>
                            <input type="number" step="0.01" id="add-cost" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入成本">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-textMuted mb-1">最低库存</label>
                            <input type="number" id="add-minStock" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入最低库存">
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        showCustomSmallModal('添加化学品', modalContent, '添加化学品', () => {
            const newData = {
                id: 'chem_' + Date.now(), // 生成唯一ID
                name: document.getElementById('add-name').value,
                category: document.getElementById('add-category').value,
                stock: parseFloat(document.getElementById('add-stock').value) || 0,
                unit: document.getElementById('add-unit').value,
                cost: parseFloat(document.getElementById('add-cost').value) || 0,
                minStock: parseFloat(document.getElementById('add-minStock').value) || 0
            };
            
            // 验证必填字段
            if (!newData.name || !newData.category) {
                alert('请填写化学品名称和分类');
                return;
            }
            
            store.updateIngredient(newData.id, newData);
            // 记录初始库存变更
            if (newData.stock > 0) {
                store.recordStockChange(newData.id, 'in', newData.stock, 'system_init', '系统');
            }
            // 显示成功通知
            showNotification('化学品添加成功', 'success');
        });
    };

    // 添加记录库存变更的函数到全局作用域
    window.recordStockChange = function(ingredientId, changeType, changeAmount, reason) {
        // 根据变更类型确定原因选项
        let reasonOptions = '';
        if (changeType === 'in') {
            // 入库操作的变更原因
            reasonOptions = `
                <option value="receipt"${reason === 'receipt' ? ' selected' : ''}>收货</option>
                <option value="adjustment"${reason === 'adjustment' ? ' selected' : ''}>库存调整</option>
                <option value="other"${reason === 'other' ? ' selected' : ''}>其他</option>
            `;
        } else {
            // 出库操作的变更原因
            reasonOptions = `
                <option value="shipment"${reason === 'shipment' ? ' selected' : ''}>出货</option>
                <option value="production"${reason === 'production' ? ' selected' : ''}>生产</option>
                <option value="adjustment"${reason === 'adjustment' ? ' selected' : ''}>库存调整</option>
                <option value="other"${reason === 'other' ? ' selected' : ''}>其他</option>
            `;
        }
        
        const modalContent = `
            <div class="space-y-4">
                <div class="grid grid-cols-1 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-textMuted mb-1">变更数量</label>
                        <input type="number" id="change-amount" value="${changeAmount || ''}" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入变更数量">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-textMuted mb-1">变更原因</label>
                        <select id="change-reason" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm">
                            ${reasonOptions}
                        </select>
                    </div>
                    <div id="other-reason-container" class="hidden">
                        <label class="block text-sm font-medium text-textMuted mb-1">请输入其他原因</label>
                        <input type="text" id="other-reason" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入其他原因">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-textMuted mb-1">操作人</label>
                        <input type="text" id="change-operator" value="管理员" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入操作人">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-textMuted mb-1">备注</label>
                        <textarea id="change-notes" rows="2" class="w-full px-3 py-2 border border-border rounded-md bg-background text-text focus:outline-none focus:ring-1 focus:ring-primary text-sm" placeholder="输入备注信息"></textarea>
                    </div>
                </div>
            </div>
        `;
        
        showCustomSmallModal(`${changeType === 'in' ? '入库' : '出库'}记录`, modalContent, '确认', () => {
            const amount = parseFloat(document.getElementById('change-amount').value);
            let reason = document.getElementById('change-reason').value;
            const operator = document.getElementById('change-operator').value || '管理员';
            const notes = document.getElementById('change-notes').value;
            
            // 如果选择了"其他"，则使用用户输入的原因
            if (reason === 'other') {
                reason = document.getElementById('other-reason').value || '其他';
            }
            
            if (!amount || amount <= 0) {
                alert('请输入有效的变更数量');
                return;
            }
            
            // 记录库存变更
            store.recordStockChange(ingredientId, changeType, amount, reason, operator);
            
            // 显示成功通知
            showNotification(`${changeType === 'in' ? '入库' : '出库'}记录成功`, 'success');
            
            // 重新渲染库存视图
            renderInventoryView();
        });
        
        // 添加原因选择变化事件监听器
        setTimeout(() => {
            const reasonSelect = document.getElementById('change-reason');
            const otherReasonContainer = document.getElementById('other-reason-container');
            
            if (reasonSelect && otherReasonContainer) {
                reasonSelect.addEventListener('change', function() {
                    if (this.value === 'other') {
                        otherReasonContainer.classList.remove('hidden');
                    } else {
                        otherReasonContainer.classList.add('hidden');
                    }
                });
                
                // 初始化时检查是否需要显示其他原因输入框
                if (reasonSelect.value === 'other') {
                    otherReasonContainer.classList.remove('hidden');
                }
            }
        }, 0);
    };

    // 显示自定义模态框的函数
    function showCustomModal(title, contentHtml, actionText, onConfirm) {
        const modalRoot = document.getElementById('modal-root');
        const modalContentWrapper = document.getElementById('modal-content-wrapper');
        
        modalContentWrapper.innerHTML = Modal(title, contentHtml, actionText);
        
        // 使用setTimeout确保DOM元素已经渲染完成后再绑定事件
        setTimeout(() => {
            // 绑定事件
            document.getElementById('modal-close').addEventListener('click', hideModal);
            document.getElementById('modal-cancel').addEventListener('click', hideModal);
            
            // 只有当onConfirm是函数时才绑定确认按钮事件
            const confirmButton = document.getElementById('modal-confirm');
            if (typeof onConfirm === 'function') {
                confirmButton.addEventListener('click', () => {
                    onConfirm();
                    // 关闭模态框
                    hideModal();
                    // 重新渲染库存视图以反映更改，保持当前分类状态
                    renderInventoryView();
                });
            } else {
                // 如果没有提供onConfirm函数，则只关闭模态框
                confirmButton.addEventListener('click', hideModal);
            }
            
            document.getElementById('modal-backdrop').addEventListener('click', hideModal);
        }, 0);
        
        modalRoot.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    // 显示小尺寸自定义模态框的函数
    function showCustomSmallModal(title, contentHtml, actionText, onConfirm) {
        const modalRoot = document.getElementById('modal-root');
        const modalContentWrapper = document.getElementById('modal-content-wrapper');
        
        modalContentWrapper.innerHTML = SmallModal(title, contentHtml, actionText);
        
        // 使用setTimeout确保DOM元素已经渲染完成后再绑定事件
        setTimeout(() => {
            // 绑定事件
            document.getElementById('modal-close').addEventListener('click', hideModal);
            document.getElementById('modal-cancel').addEventListener('click', hideModal);
            
            // 只有当onConfirm是函数时才绑定确认按钮事件
            const confirmButton = document.getElementById('modal-confirm');
            if (typeof onConfirm === 'function') {
                confirmButton.addEventListener('click', () => {
                    onConfirm();
                    // 关闭模态框
                    hideModal();
                    // 重新渲染库存视图以反映更改，保持当前分类状态
                    renderInventoryView();
                });
            } else {
                // 如果没有提供onConfirm函数，则只关闭模态框
                confirmButton.addEventListener('click', hideModal);
            }
            
            document.getElementById('modal-backdrop').addEventListener('click', hideModal);
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

    // 显示通知消息的函数
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `
            px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
            ${type === 'success' ? 'bg-green-500 text-white' : ''}
            ${type === 'error' ? 'bg-red-500 text-white' : ''}
            ${type === 'info' ? 'bg-blue-500 text-white' : ''}
        `;
        notification.textContent = message;
        notification.style.transform = 'translateX(100%)';
        
        // 添加到容器
        container.appendChild(notification);
        
        // 触发进入动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 添加切换分类的函数到全局作用域
    window.switchCategory = function(category) {
        activeCategory = category;
        // 更新URL参数以保持分类状态
        const url = new URL(window.location);
        url.searchParams.set('category', category);
        window.history.replaceState({}, '', url);
        renderInventoryView();
    };

    // 渲染库存视图的函数
    function renderInventoryView() {
        div.innerHTML = `
            <div class="flex flex-col h-full">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-xl font-bold">化学品库存管理</h2>
                    <button class="bg-primary text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center" onclick="showAddIngredientModal()">
                        <i data-lucide="plus" class="w-4 h-4 mr-2"></i> 添加化学品
                    </button>
                </div>
                ${renderCategoryTabs()}
                <div class="flex-1 overflow-hidden">
                    <div class="h-full overflow-y-auto">
                        ${Table({ headers, rows: getFilteredIngredients(), renderCell: renderRow })}
                    </div>
                </div>
            </div>
        `;
        
        // 重新绑定分类标签的点击事件
        setTimeout(() => {
            document.querySelectorAll('.category-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const category = e.target.getAttribute('data-category');
                    activeCategory = category;
                    // 更新URL参数以保持分类状态
                    const url = new URL(window.location);
                    url.searchParams.set('category', category);
                    window.history.replaceState({}, '', url);
                    renderInventoryView();
                });
            });
            
            // 重新初始化Lucide图标
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        }, 0);
    }

    // 添加显示库存历史记录的函数到全局作用域
    window.showStockHistory = function(ingredientId) {
        const ingredient = store.getIngredient(ingredientId);
        if (!ingredient) return;
        
        // 获取该化学品的库存变更记录
        const stockChanges = store.getStockChangesForIngredient(ingredientId);
        
        // 按时间倒序排列
        const sortedChanges = [...stockChanges].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
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
        
        const modalContent = `
            <div class="space-y-4">
                <div class="overflow-x-auto rounded-xl border border-border bg-surface">
                    ${sortedChanges.length > 0 ? `
                        <table class="min-w-full border-collapse">
                            <thead class="bg-surfaceHover">
                                <tr>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">时间</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">变更类型</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">数量</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">变更后库存</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">原因</th>
                                    <th class="px-4 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider border-b border-border">操作人</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sortedChanges.map(change => `
                                    <tr class="table-row-hover transition-colors border-b border-border last:border-0">
                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-textMuted">${formatDate(change.timestamp)}</td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm">
                                            <span class="${change.changeType === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2.5 py-1 rounded-full text-xs font-medium">
                                                ${changeTypeMap[change.changeType] || change.changeType}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm">
                                            <span class="${change.changeType === 'in' ? 'text-green-600' : 'text-red-600'} font-medium">
                                                ${change.changeType === 'in' ? '+' : ''}${change.changeAmount} ${change.unit}
                                            </span>
                                        </td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">${change.newStock} ${change.unit}</td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-textMuted">${reasonMap[change.reason] || change.reason}</td>
                                        <td class="px-4 py-3 whitespace-nowrap text-sm text-textMuted">${change.operator}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    ` : `
                        <div class="p-8 text-center">
                            <i data-lucide="package" class="w-12 h-12 text-textMuted mx-auto mb-4"></i>
                            <h4 class="text-lg font-medium text-text mb-2">暂无库存变更记录</h4>
                            <p class="text-textMuted">该化学品尚未有任何库存变更</p>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        // 对于只读的模态框，我们不需要确认回调
        showCustomModal(`库存历史记录 - ${ingredient.name}`, modalContent, '关闭', null);
    };

    // 初始渲染
    renderInventoryView();

    return div;
};