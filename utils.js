export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(amount);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export const generateId = (prefix = 'id') => {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getStatusColor = (status) => {
    const colors = {
        'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'processing': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'completed': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        'in_progress': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'planned': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        'low_stock': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

export const translateStatus = (status) => {
    const map = {
        'active': '启用',
        'pending': '待处理',
        'processing': '处理中',
        'completed': '已完成',
        'in_progress': '生产中',
        'planned': '已计划',
        'low_stock': '库存不足'
    };
    return map[status] || status;
};
