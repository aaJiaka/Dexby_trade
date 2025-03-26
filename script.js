// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Обработка отправки формы
const form = document.querySelector('.contact-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = form.querySelector('button[type="submit"]');
        
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
        
        try {
            // Имитация отправки
            await new Promise(resolve => setTimeout(resolve, 1500));
            form.reset();
            submitButton.textContent = 'Отправлено!';
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Отправить';
            }, 2000);
        } catch (error) {
            submitButton.textContent = 'Ошибка';
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Отправить';
            }, 2000);
        }
    });
}

// Простое изменение фона навбара при прокрутке
const navbar = document.querySelector('.navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Обработка слайдеров
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        slider.addEventListener('input', () => {
            const value = slider.value;
            const unit = valueDisplay.textContent.includes('%') ? '%' : 'x';
            valueDisplay.textContent = `${value}${unit}`;
        });
    });

    // Обработка кнопок временных интервалов
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            timeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Update chart data based on selected time period
            updateChartData(button.dataset.period);
        });
    });

    // Создание графика
    function createChart() {
        const chartArea = document.querySelector('.chart-candles');
        const numCandles = 40;
        
        // Очищаем предыдущие свечи
        chartArea.innerHTML = '';
        
        // Генерируем случайные свечи с более реалистичным поведением
        let prevClose = 41000 + Math.random() * 1000;
        
        for (let i = 0; i < numCandles; i++) {
            const candle = document.createElement('div');
            candle.className = 'candle';
            
            // Генерируем более реалистичные цены
            const change = (Math.random() - 0.5) * 200;
            const close = prevClose + change;
            const height = 20 + Math.abs(change) / 10;
            const isGreen = close > prevClose;
            
            candle.className = `candle ${isGreen ? 'up' : 'down'}`;
            candle.style.height = `${height}%`;
            
            // Добавляем тени (фитили)
            const wickHeight = 10 + Math.random() * 15;
            const wick = document.createElement('div');
            wick.className = 'wick';
            wick.style.height = `${wickHeight}%`;
            
            candle.appendChild(wick);
            chartArea.appendChild(candle);
            
            prevClose = close;
        }
        
        // Добавляем столбцы объема с корреляцией с движением цены
        const volumeArea = document.querySelector('.volume-bar');
        volumeArea.innerHTML = '';
        
        for (let i = 0; i < numCandles; i++) {
            const volume = document.createElement('div');
            const height = 20 + Math.random() * 60;
            const isHighVolume = Math.random() > 0.7;
            
            volume.style.cssText = `
                flex: 1;
                height: ${height * (isHighVolume ? 1.5 : 1)}%;
                background: ${isHighVolume ? 'var(--gray-600)' : 'var(--gray-700)'};
                border-radius: 2px;
                transition: height 0.3s ease;
            `;
            
            volumeArea.appendChild(volume);
        }

        // Анимируем линию MA
        const maLine = document.querySelector('.ma-line');
        if (maLine) {
            maLine.style.transform = `translateY(${30 + Math.random() * 40}%)`;
        }

        // Обновляем RSI индикатор
        const rsiIndicator = document.querySelector('.rsi-indicator');
        if (rsiIndicator) {
            const rsiValue = 30 + Math.random() * 40;
            rsiIndicator.style.background = `linear-gradient(90deg, 
                rgba(239, 68, 68, 0.2) 0%,
                rgba(37, 99, 235, 0.2) ${rsiValue}%,
                rgba(16, 185, 129, 0.2) 100%
            )`;
        }
    }

    // Обновление графика при смене временного интервала
    function updateChart(timeframe) {
        const chart = document.querySelector('.candlestick-chart');
        const timeframeMap = {
            '1H': 40,
            '4H': 35,
            '1D': 30,
            '1W': 25
        };
        
        // Анимация обновления
        chart.style.opacity = '0.5';
        
        setTimeout(() => {
            // Обновляем количество свечей в зависимости от таймфрейма
            const numCandles = timeframeMap[timeframe] || 40;
            createChart(numCandles);
            
            // Обновляем цену и процент изменения
            const priceChange = (Math.random() * 4 - 2).toFixed(2);
            const priceElement = document.querySelector('.pair-price');
            const changeElement = document.querySelector('.price-change');
            
            if (priceElement && changeElement) {
                const currentPrice = parseFloat(priceElement.textContent.replace(',', ''));
                const newPrice = (currentPrice * (1 + parseFloat(priceChange) / 100)).toFixed(2);
                
                priceElement.textContent = newPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                changeElement.textContent = `${priceChange > 0 ? '+' : ''}${priceChange}%`;
                changeElement.className = `price-change ${priceChange > 0 ? 'positive' : 'negative'}`;
            }
            
            chart.style.opacity = '1';
        }, 300);
    }

    // Инициализация графика при загрузке
    createChart();

    // Обработка кнопки применения стратегии
    const applyButton = document.querySelector('.apply-btn');
    applyButton.addEventListener('click', () => {
        applyButton.disabled = true;
        applyButton.innerHTML = `
            <span class="btn-icon">⌛</span>
            <span class="btn-text">Применяем...</span>
        `;
        
        setTimeout(() => {
            applyButton.innerHTML = `
                <span class="btn-icon">✓</span>
                <span class="btn-text">Стратегия применена</span>
            `;
            applyButton.disabled = false;
            
            // Показываем уведомление об успехе
            showNotification('Стратегия успешно применена');
        }, 1500);
    });

    // Функция показа уведомления
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Добавляем стили для уведомлений
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100%);
            background: var(--success);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(-50%) translateY(0);
        }
        
        .candle {
            transition: height 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Создаем дополнительные точки для паттерна
    const pattern = document.querySelector('.pattern-lines');
    const numPoints = 50;
    
    for (let i = 0; i < numPoints; i++) {
        const point = document.createElement('div');
        point.className = 'pattern-point';
        point.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        pattern.appendChild(point);
    }

    // Создаем линии между точками
    const numLines = 30;
    for (let i = 0; i < numLines; i++) {
        const line = document.createElement('div');
        line.className = 'pattern-line';
        line.style.cssText = `
            position: absolute;
            width: ${50 + Math.random() * 200}px;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            transform: rotate(${Math.random() * 360}deg);
        `;
        pattern.appendChild(line);
    }

    // Анимация паттерна
    let offset = 0;
    function animatePattern() {
        offset += 0.2;
        const points = document.querySelectorAll('.pattern-point');
        const lines = document.querySelectorAll('.pattern-line');
        
        points.forEach((point, index) => {
            const x = Math.sin(offset * 0.01 + index) * 20;
            const y = Math.cos(offset * 0.01 + index) * 20;
            point.style.transform = `translate(${x}px, ${y}px)`;
        });

        lines.forEach((line, index) => {
            const rotation = Math.sin(offset * 0.005 + index) * 10;
            line.style.transform = `rotate(${rotation}deg)`;
        });

        requestAnimationFrame(animatePattern);
    }

    // Запускаем анимацию
    animatePattern();

    // Добавляем эффект при наведении на кнопку
    const button = document.querySelector('.install-button');
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });

    // Chart data for different time periods
    const chartData = {
        '1H': [65, 72, 68, 75, 70, 73, 69, 74, 71, 76],
        '4H': [60, 68, 65, 70, 67, 72, 69, 73, 71, 75],
        '1D': [55, 63, 60, 67, 64, 69, 66, 70, 68, 72],
        '1W': [50, 58, 55, 62, 59, 64, 61, 65, 63, 67]
    };

    // Update chart visualization
    function updateChartData(period) {
        const data = chartData[period];
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach((bar, index) => {
            const height = data[index];
            bar.style.height = `${height}%`;
            // Add success class to bars with height > 70%
            if (height > 70) {
                bar.classList.add('success');
            } else {
                bar.classList.remove('success');
            }
        });
    }

    // Initialize chart with 1H data
    updateChartData('1H');

    // Button hover effect
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn, .get-started-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Stats animation on scroll
    const stats = document.querySelectorAll('.stat-value');
    const animateStats = () => {
        stats.forEach(stat => {
            const value = parseInt(stat.dataset.value);
            let current = 0;
            const increment = value / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    clearInterval(timer);
                    current = value;
                }
                stat.textContent = Math.round(current).toLocaleString();
            }, 20);
        });
    };

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));

    // Initialize trading chart
    const initTradingChart = () => {
        const ctx = document.getElementById('tradingChart').getContext('2d');
        
        // Generate sample data
        const generateData = () => {
            const data = [];
            let value = 43000;
            for (let i = 0; i < 50; i++) {
                value = value + Math.random() * 200 - 100;
                data.push(value);
            }
            return data;
        };

        const data = generateData();
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(50).fill(''),
                datasets: [{
                    label: 'BTC/USDT',
                    data: data,
                    borderColor: '#6366F1',
                    borderWidth: 2,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: '#6366F1',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: '#1E293B',
                        titleColor: '#F8FAFC',
                        bodyColor: '#94A3B8',
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: (context) => {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
    };

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Initialize time controls
    const initTimeControls = () => {
        const timeButtons = document.querySelectorAll('.time-btn');
        timeButtons.forEach(button => {
            button.addEventListener('click', () => {
                timeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    };

    // Initialize all components
    initTradingChart();
    initTimeControls();

    function initDashboardCharts() {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    padding: 10,
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#374151',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0,
                    hitRadius: 0
                },
                line: {
                    tension: 0.4
                }
            }
        };

        // Alpha Strategy Chart
        const alphaCtx = document.getElementById('alphaChart').getContext('2d');
        const alphaData = generateChartData(24.5);
        new Chart(alphaCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 12}, (_, i) => `Day ${i + 1}`),
                datasets: [{
                    data: alphaData,
                    borderColor: '#10B981',
                    backgroundColor: createGradient(alphaCtx, '#10B981'),
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });

        // Beta Strategy Chart
        const betaCtx = document.getElementById('betaChart').getContext('2d');
        const betaData = generateChartData(18.7);
        new Chart(betaCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 12}, (_, i) => `Day ${i + 1}`),
                datasets: [{
                    data: betaData,
                    borderColor: '#6366F1',
                    backgroundColor: createGradient(betaCtx, '#6366F1'),
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });

        // Gamma Strategy Chart
        const gammaCtx = document.getElementById('gammaChart').getContext('2d');
        const gammaData = generateChartData(15.2);
        new Chart(gammaCtx, {
            type: 'line',
            data: {
                labels: Array.from({length: 12}, (_, i) => `Day ${i + 1}`),
                datasets: [{
                    data: gammaData,
                    borderColor: '#F59E0B',
                    backgroundColor: createGradient(gammaCtx, '#F59E0B'),
                    fill: true,
                    borderWidth: 2
                }]
            },
            options: chartOptions
        });
    }

    function generateChartData(finalReturn) {
        const points = 12;
        const volatility = 0.3;
        const data = [];
        let currentValue = 0;

        for (let i = 0; i < points; i++) {
            const progress = i / (points - 1);
            const targetValue = finalReturn * progress;
            const randomness = (Math.random() - 0.5) * volatility * finalReturn;
            currentValue = targetValue + randomness;
            data.push(currentValue);
        }

        // Ensure the last point matches the target return
        data[points - 1] = finalReturn;
        return data;
    }

    function createGradient(ctx, color) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 150);
        gradient.addColorStop(0, `${color}20`);
        gradient.addColorStop(1, `${color}00`);
        return gradient;
    }

    // Initialize all components when DOM is loaded
    initTradingChart();
    initDashboardCharts();

    // Initialize performance chart
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Generate performance data
    const generatePerformanceData = () => {
        const data = [];
        let value = 0;
        for (let i = 0; i < 20; i++) {
            value += Math.random() * 20 - 5;
            data.push(value);
        }
        return data.map(v => v + 355.3); // Adjust to match final value
    };

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.2)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');

    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                data: generatePerformanceData(),
                backgroundColor: (context) => {
                    const value = context.raw;
                    return value >= 355.3 ? '#22C55E' : '#4F46E5';
                },
                borderWidth: 0,
                borderRadius: 4,
                barThickness: 12,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
});