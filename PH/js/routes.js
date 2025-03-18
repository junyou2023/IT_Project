// routes.js
const routes = {
  // 主入口点
  mainEntryPoints: {
    home: 'index.html',
    auth: 'login.html',
    categories: 'cuisines.html',
    about: 'about.html'
  },

  // 餐厅发现流程
  discoveryFlow: {
    search: 'search.html',
    restaurantListing: 'restaurants.html',
    restaurantDetail: 'restaurant-detail.html'
  },

  // 用户仪表板
  userDashboard: {
    profile: 'profile.html',
    reviews: 'reviews.html',
    favorites: 'favorites.html',
    bookingHistory: 'bookings.html'
  },

  // 餐厅仪表板
  restaurantDashboard: {
    overview: 'restaurant-dashboard.html',
    profile: 'restaurant-profile.html',
    menu: 'menu-management.html',
    reservations: 'reservation-management.html',
    analytics: 'analytics.html'
  },

  // 管理员面板
  adminPanel: {
    userManagement: 'admin/users.html',
    restaurantApproval: 'admin/approvals.html',
    contentModeration: 'admin/moderation.html',
    systemSettings: 'admin/settings.html'
  }
};
