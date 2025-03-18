// events.js
document.addEventListener('DOMContentLoaded', () => {
  // 搜索表单提交
  const searchForm = document.querySelector('#searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = document.querySelector('#searchInput').value;
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    });
  }

  // 收藏按钮
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  favoriteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const restaurantId = btn.dataset.id;
      toggleFavorite(restaurantId);
    });
  });

  // 评论提交
  const reviewForm = document.querySelector('#reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitReview();
    });
  }
});
