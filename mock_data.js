import { categories } from './data.js';
import { generateId } from './utils.js';

// 创建从data.js生成初始库存数据的函数
export function generateInitialIngredients() {
    const chemicalIngredients = [];
    let idCounter = 100;

    categories.forEach(category => {
        category.items.forEach(item => {
            // 只提取分类名称的中文部分
            const categoryName = category.name.split(' (')[0];
            
            chemicalIngredients.push({
                id: `chem_${idCounter++}`,
                name: item.name,
                unit: 'kg',
                stock: item.stock,
                cost: item.price,
                minStock: Math.floor(item.stock * 0.2), // 设置最低库存为当前库存的20%
                category: categoryName // 只使用中文名称
            });
        });
    });
    
    return chemicalIngredients;
}

// 生成初始库存变更记录
export function generateInitialStockChanges() {
    // 初始库存变更记录可以为空
    return [];
}

// 生成示例配方数据
export function generateInitialRecipes(ingredients) {
    // 创建一些示例配方
    const recipes = [
        {
            id: 'recipe_1',
            name: '标准PVC配方',
            category: 'PVC制品',
            yield: 1000,
            unit: 'kg',
            sellingPricePerKg: 15.5,
            profitMargin: 0.2,
            modules: {
                base: {
                    name: '基础原料',
                    ingredients: [
                        { id: ingredients[0]?.id || 'chem_100', ratio: 60 },
                        { id: ingredients[1]?.id || 'chem_101', ratio: 30 },
                        { id: ingredients[2]?.id || 'chem_102', ratio: 10 }
                    ]
                },
                color: {
                    name: '配色模块',
                    ingredients: [
                        { id: ingredients[5]?.id || 'chem_105', ratio: 2 },
                        { id: ingredients[6]?.id || 'chem_106', ratio: 1 }
                    ]
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'recipe_2',
            name: '耐寒电缆配方',
            category: '电缆材料',
            yield: 1000,
            unit: 'kg',
            sellingPricePerKg: 18.0,
            profitMargin: 0.15,
            modules: {
                base: {
                    name: '基础原料',
                    ingredients: [
                        { id: ingredients[3]?.id || 'chem_103', ratio: 50 },
                        { id: ingredients[4]?.id || 'chem_104', ratio: 40 },
                        { id: ingredients[7]?.id || 'chem_107', ratio: 10 }
                    ]
                },
                color: {
                    name: '配色模块',
                    ingredients: [
                        { id: ingredients[8]?.id || 'chem_108', ratio: 1 }
                    ]
                }
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
    
    return recipes;
}

// 初始化数据对象，但不直接生成数据
export const INITIAL_DATA = {
    ingredients: [], // 空数组，将在Store中根据缓存情况填充
    recipes: [], // 空数组，将在Store中填充
    orders: [],
    production: [],
    stockChanges: [] // 添加库存变更记录
};