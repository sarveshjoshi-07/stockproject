const stockInput = document.getElementById('stock-input');
const searchBtn = document.getElementById('search-btn');
const stockName = document.getElementById('stock-name');
const stockPrice = document.getElementById('stock-price');
const stockChange = document.getElementById('stock-change');
const stockChart = document.getElementById('stock-chart').getContext('2d');

let chart;

const API_KEY = 'A86P04LPXN3MK3U4';
async function fetchStockData(symbol) {
    try {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data['Time Series (Daily)']) {
            updateUI(symbol, data['Time Series (Daily)']);
        } else if (data['Error Message']) {
            alert('Invalid stock symbol. Please try again.');
        } else {
            alert('Unexpected error occurred. Please try again later.');
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
        alert('Network issue or API limit exceeded. Please try again later.');
    }
}

function updateUI(symbol, timeSeries) {
    const dates = Object.keys(timeSeries).slice(0, 15);
    const latestData = timeSeries[dates[0]];

    const latestPrice = parseFloat(latestData['4. close']);
    const previousPrice = parseFloat(timeSeries[dates[1]]['4. close']);
    const changePercent = (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(2);
    const volume = latestData['5. volume'];
    const highPrice = latestData['2. high'];
    const lowPrice = latestData['3. low'];

    stockName.textContent = symbol.toUpperCase();
    stockPrice.textContent = `Price: $${latestPrice.toFixed(2)}`;
    stockChange.textContent = `Change: ${changePercent}%`;

    // Display additional info
    document.getElementById('stock-volume').textContent = `Volume: ${volume}`;
    document.getElementById('stock-high').textContent = `High: $${highPrice}`;
    document.getElementById('stock-low').textContent = `Low: $${lowPrice}`;

    updateChart(dates.reverse(), dates.map(date => parseFloat(timeSeries[date]['4. close'])).reverse());
}

function updateChart(dates, prices) {
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(stockChart, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock Price (USD)',
                data: prices,
                backgroundColor: 'rgba(130, 92, 255, 0.2)',
                borderColor: '#825CFF',
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#825CFF',
                pointHoverRadius: 8,
                pointHoverBackgroundColor: '#6b4ae8',
                pointHoverBorderColor: '#ffffff',
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1500,
                easing: 'easeInOutCubic'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#333',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#825CFF',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    cornerRadius: 5,
                    callbacks: {
                        label: function(context) {
                            return `Date: ${context.label}, Price: $${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#333',
                        font: {
                            size: 12
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(130, 92, 255, 0.1)'
                    },
                    ticks: {
                        color: '#333',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

searchBtn.addEventListener('click', () => {
    const symbol = stockInput.value.trim();
    if (symbol) {
        fetchStockData(symbol);
    } else {
        alert('Please enter a stock symbol!');
    }
});
