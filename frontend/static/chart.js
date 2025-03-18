// Revenue Chart Configuration
function initRevenueChart() {
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  return new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [3000, 3500, 2800, 4200, 3800, 4500],
        borderColor: '#FF4B2B',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(255, 75, 43, 0.1)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Popular Items Chart Configuration
function initItemsChart() {
  const itemsCtx = document.getElementById('itemsChart').getContext('2d');
  return new Chart(itemsCtx, {
    type: 'doughnut',
    data: {
      labels: ['Pizza', 'Pasta', 'Salad', 'Dessert'],
      datasets: [{
        data: [45, 25, 20, 10],
        backgroundColor: [
          '#FF4B2B',
          '#4158D0',
          '#23D5AB',
          '#FF416C'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}
