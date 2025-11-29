import { INITIAL_DATA } from './mock_data.js';
import { generateInitialIngredients, generateInitialStockChanges, generateInitialRecipes } from './mock_data.js';

class Store {
    constructor() {
        this.state = this.loadState();
        this.listeners = [];
    }

    loadState() {
        try {
            // 首先尝试从localStorage加载数据
            const saved = localStorage.getItem('rms_state');
            if (saved) {
                // 如果localStorage中有数据，直接使用
                const parsedState = JSON.parse(saved);
                // 确保stockChanges字段存在
                if (!parsedState.stockChanges || !Array.isArray(parsedState.stockChanges)) {
                    parsedState.stockChanges = [];
                }
                // 确保recipes字段存在
                if (!parsedState.recipes || !Array.isArray(parsedState.recipes)) {
                    parsedState.recipes = [];
                }
                return parsedState;
            } else {
                // 如果localStorage中没有数据，从data.js生成初始数据
                const initialState = { ...INITIAL_DATA };
                initialState.ingredients = generateInitialIngredients();
                initialState.stockChanges = generateInitialStockChanges();
                initialState.recipes = generateInitialRecipes(initialState.ingredients);
                return initialState;
            }
        } catch (error) {
            console.warn('无法访问localStorage，使用默认数据:', error);
            // 如果无法访问localStorage，使用默认数据
            const initialState = { ...INITIAL_DATA };
            initialState.ingredients = generateInitialIngredients();
            initialState.stockChanges = generateInitialStockChanges();
            initialState.recipes = generateInitialRecipes(initialState.ingredients);
            return initialState;
        }
    }

    saveState() {
        try {
            localStorage.setItem('rms_state', JSON.stringify(this.state));
            this.notify();
        } catch (error) {
            console.warn('无法保存到localStorage:', error);
            // 即使无法保存到localStorage，仍然通知监听器
            this.notify();
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // 记录库存变更
    recordStockChange(ingredientId, changeType, changeAmount, reason, operator) {
        const ingredient = this.getIngredient(ingredientId);
        if (!ingredient) return;

        const oldStock = ingredient.stock;
        const newStock = changeType === 'in' ? oldStock + changeAmount : oldStock - changeAmount;

        const stockChange = {
            id: 'change_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ingredientId: ingredientId,
            ingredientName: ingredient.name,
            changeType: changeType, // 'in' 表示入库, 'out' 表示出库
            changeAmount: changeAmount,
            newStock: newStock,
            oldStock: oldStock,
            unit: ingredient.unit,
            reason: reason,
            operator: operator,
            timestamp: new Date().toISOString()
        };

        // 更新库存
        this.updateIngredient(ingredientId, { stock: newStock });

        // 确保state.stockChanges存在且为数组
        if (!this.state.stockChanges || !Array.isArray(this.state.stockChanges)) {
            this.state.stockChanges = [];
        }

        // 添加变更记录
        this.state.stockChanges.unshift(stockChange);
        this.saveState();

        return stockChange;
    }

    updateIngredient(id, data) {
        const idx = this.state.ingredients.findIndex(i => i.id === id);
        if (idx >= 0) {
            this.state.ingredients[idx] = { ...this.state.ingredients[idx], ...data };
        } else {
            this.state.ingredients.push({ id, ...data });
        }
        this.saveState();
    }

    deleteIngredient(id) {
        this.state.ingredients = this.state.ingredients.filter(i => i.id !== id);
        this.saveState();
    }

    addOrder(order) {
        this.state.orders.unshift(order);
        this.saveState();
    }

    addProduction(plan) {
        this.state.production.push(plan);
        this.saveState();
    }

    getIngredient(id) {
        return this.state.ingredients.find(i => i.id === id);
    }

    getRecipe(id) {
        return this.state.recipes.find(r => r.id === id);
    }
    
    // 添加配方
    addRecipe(recipe) {
        this.state.recipes.push(recipe);
        this.saveState();
    }
    
    // 更新配方
    updateRecipe(id, data) {
        const idx = this.state.recipes.findIndex(r => r.id === id);
        if (idx >= 0) {
            this.state.recipes[idx] = { ...this.state.recipes[idx], ...data, updatedAt: new Date().toISOString() };
            this.saveState();
        }
    }
    
    // 删除配方
    deleteRecipe(id) {
        this.state.recipes = this.state.recipes.filter(r => r.id !== id);
        this.saveState();
    }
    
    getCost(recipeId) {
        const recipe = this.getRecipe(recipeId);
        if (!recipe) return 0;
        let total = 0;
        
        // 计算基础原料成本
        if (recipe.modules && recipe.modules.base && recipe.modules.base.ingredients) {
            total += recipe.modules.base.ingredients.reduce((sum, item) => {
                const ing = this.getIngredient(item.id);
                return sum + (ing ? ing.cost * (item.ratio / 100) : 0);
            }, 0);
        }
        
        // 计算配色模块成本
        if (recipe.modules && recipe.modules.color && recipe.modules.color.ingredients) {
            total += recipe.modules.color.ingredients.reduce((sum, item) => {
                const ing = this.getIngredient(item.id);
                return sum + (ing ? ing.cost * (item.ratio / 100) : 0);
            }, 0);
        }
        
        return total;
    }
    
    // 计算配方售价
    getSellingPrice(recipeId) {
        const recipe = this.getRecipe(recipeId);
        if (!recipe) return 0;
        const cost = this.getCost(recipeId);
        return cost * (1 + recipe.profitMargin);
    }
    
    // 根据总吨数计算每个材料的用量和价格
    calculateRecipeDetails(recipeId, totalTons) {
        const recipe = this.getRecipe(recipeId);
        if (!recipe) return null;
        
        const totalKg = totalTons * 1000;
        const details = {
            baseMaterials: [],
            colorMaterials: [],
            totalCost: 0,
            totalPrice: 0,
            profit: 0
        };
        
        // 计算基础原料
        if (recipe.modules && recipe.modules.base && recipe.modules.base.ingredients) {
            recipe.modules.base.ingredients.forEach(item => {
                const ing = this.getIngredient(item.id);
                if (ing) {
                    const qty = totalKg * (item.ratio / 100);
                    const cost = ing.cost * qty;
                    details.baseMaterials.push({
                        id: ing.id,
                        name: ing.name,
                        ratio: item.ratio,
                        quantity: qty,
                        unit: 'kg',
                        unitPrice: ing.cost,
                        cost: cost
                    });
                    details.totalCost += cost;
                }
            });
        }
        
        // 计算配色模块
        if (recipe.modules && recipe.modules.color && recipe.modules.color.ingredients) {
            recipe.modules.color.ingredients.forEach(item => {
                const ing = this.getIngredient(item.id);
                if (ing) {
                    const qty = totalKg * (item.ratio / 100);
                    const cost = ing.cost * qty;
                    details.colorMaterials.push({
                        id: ing.id,
                        name: ing.name,
                        ratio: item.ratio,
                        quantity: qty,
                        unit: 'kg',
                        unitPrice: ing.cost,
                        cost: cost
                    });
                    details.totalCost += cost;
                }
            });
        }
        
        // 计算总售价和利润
        details.totalPrice = details.totalCost * (1 + recipe.profitMargin);
        details.profit = details.totalPrice - details.totalCost;
        
        return details;
    }

    // 获取特定化学品的库存变更记录
    getStockChangesForIngredient(ingredientId) {
        // 确保state.stockChanges存在且为数组
        if (!this.state.stockChanges || !Array.isArray(this.state.stockChanges)) {
            return [];
        }
        
        return this.state.stockChanges.filter(change => change.ingredientId === ingredientId);
    }

    // 获取所有库存变更记录
    getAllStockChanges() {
        return this.state.stockChanges;
    }
}

export const store = new Store();