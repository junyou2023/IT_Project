// state.js
const PageState = {
  // 当前用户信息
  currentUser: null,
  
  // 导航历史
  navigationHistory: [],
  
  // 搜索状态
  searchFilters: {
    cuisine: null,
    price: null,
    rating: null,
    location: null
  },
  
  // 更新导航历史
  updateHistory(page) {
    this.navigationHistory.push(page);
    if (this.navigationHistory.length > 5) {
      this.navigationHistory.shift();
    }
  },
  
  // 获取上一页
  getPreviousPage() {
    return this.navigationHistory[this.navigationHistory.length - 2] || 'index.html';
  }
};
