// navigation.js
document.addEventListener('DOMContentLoaded', function() {
  // 处理导航逻辑
  const setupNavigation = () => {
    // 餐厅列表到详情页
    document.querySelectorAll('.restaurant-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const restaurantId = card.dataset.id;
        window.location.href = `restaurant-detail.html?id=${restaurantId}`;
      });
    });

    // 美食分类到分类详情页
    document.querySelectorAll('.cuisine-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const cuisineId = card.dataset.id;
        window.location.href = `cuisine-detail.html?id=${cuisineId}`;
      });
    });

    // 搜索结果到餐厅详情页
    document.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const restaurantId = item.dataset.id;
        window.location.href = `restaurant-detail.html?id=${restaurantId}`;
      });
    });
  };

  // 处理用户认证状态
  const handleAuthState = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userMenu = document.getElementById('userMenu');
    const authButtons = document.getElementById('authButtons');

    if (isLoggedIn) {
      userMenu.classList.remove('d-none');
      authButtons.classList.add('d-none');
    } else {
      userMenu.classList.add('d-none');
      authButtons.classList.remove('d-none');
    }
  };

  setupNavigation();
  handleAuthState();
});
