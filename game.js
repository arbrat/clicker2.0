// Основные переменные игры
let clicks = 0;
let totalClicks = 0;
let clickPower = 1;
let cps = 0;
let currentBackground = 0;
let rouletteSpins = 0;
let achievementsEarned = 0;

// Система сохранения
const saveGame = () => {
    const gameData = {
        clicks,
        totalClicks,
        clickPower,
        cps,
        currentBackground,
        rouletteSpins,
        achievementsEarned,
        clickUpgrades: clickUpgrades,
        autoClickers: autoClickers,
        achievements: achievements
    };
    localStorage.setItem('clickerSave', JSON.stringify(gameData));
};

const loadGame = () => {
    const savedData = localStorage.getItem('clickerSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);
        
        clicks = gameData.clicks || 0;
        totalClicks = gameData.totalClicks || 0;
        clickPower = gameData.clickPower || 1;
        cps = gameData.cps || 0;
        currentBackground = gameData.currentBackground || 0;
        rouletteSpins = gameData.rouletteSpins || 0;
        achievementsEarned = gameData.achievementsEarned || 0;
        
        if (gameData.clickUpgrades) {
            for (const key in gameData.clickUpgrades) {
                if (clickUpgrades[key]) {
                    clickUpgrades[key].owned = gameData.clickUpgrades[key].owned || 0;
                    clickUpgrades[key].cost = gameData.clickUpgrades[key].cost || clickUpgrades[key].baseCost;
                }
            }
        }
        
        if (gameData.autoClickers) {
            for (const key in gameData.autoClickers) {
                if (autoClickers[key]) {
                    autoClickers[key].owned = gameData.autoClickers[key].owned || 0;
                    autoClickers[key].cost = gameData.autoClickers[key].cost || autoClickers[key].baseCost;
                }
            }
        }
        
        if (gameData.achievements) {
            for (const key in gameData.achievements) {
                if (achievements[key]) {
                    achievements[key].earned = gameData.achievements[key].earned || false;
                }
            }
        }
        
        updateBackground(currentBackground);
    }
};

// Фоны
const backgrounds = [
    { cost: 0, image: 'https://via.placeholder.com/1920x1080/f0f0f0/cccccc?text=Стандартный+фон' },
    { cost: 100000, image: 'IMG_20250605_130147_014.jpg' },
    { cost: 250000, image: 'IMG_20250605_132336.jpg' },
    { cost: 500000, image: 'IMG_20250605_134029.jpg' },
    { cost: 1000000, image: 'IMG_20250605_134117.jpg' }
];

// Улучшения кликов
const clickUpgrades = {
    1: { name: "Улучшенный палец", power: 1, baseCost: 50, cost: 50, owned: 0, description: "Увеличивает силу клика на 1" },
    2: { name: "Золотой палец", power: 5, baseCost: 250, cost: 250, owned: 0, description: "Увеличивает силу клика на 5" },
    3: { name: "Платиновый палец", power: 20, baseCost: 1000, cost: 1000, owned: 0, description: "Увеличивает силу клика на 20" },
    4: { name: "Алмазный палец", power: 50, baseCost: 5000, cost: 5000, owned: 0, description: "Увеличивает силу клика на 50" },
    5: { name: "Легендарный палец", power: 100, baseCost: 25000, cost: 25000, owned: 0, description: "Увеличивает силу клика на 100" }
};

// Автокликеры
const autoClickers = {
    1: { name: "Автокликер", power: 1, baseCost: 50, cost: 50, owned: 0, description: "Добавляет 1 клик/сек" },
    2: { name: "Жирный кликер", power: 5, baseCost: 250, cost: 250, owned: 0, description: "Добавляет 5 клик/сек" },
    3: { name: "Хуй большой кликер", power: 20, baseCost: 1000, cost: 1000, owned: 0, description: "Добавляет 20 клик/сек" },
    4: { name: "Ультра мега кликер", power: 50, baseCost: 5000, cost: 5000, owned: 0, description: "Добавляет 50 клик/сек" },
    5: { name: "Гей кликер", power: 300, baseCost: 25000, cost: 25000, owned: 0, description: "Добавляет 300 клик/сек" },
    6: { name: "Теракт кликер", power: 1500, baseCost: 100000, cost: 100000, owned: 0, description: "Добавляет 1,500 клик/сек" },
    7: { name: "Пидор кликер", power: 7500, baseCost: 500000, cost: 500000, owned: 0, description: "Добавляет 7,500 клик/сек" },
    8: { name: "Родной кликер", power: 30000, baseCost: 2500000, cost: 2500000, owned: 0, description: "Добавляет 30,000 клик/сек" },
    9: { name: "Семья кликер", power: 150000, baseCost: 10000000, cost: 10000000, owned: 0, description: "Добавляет 150,000 клик/сек" },
    10: { name: "Динаху кликер", power: 750000, baseCost: 50000000, cost: 50000000, owned: 0, description: "Добавляет 750,000 клик/сек" }
};

// Достижения
const achievements = {
    1: { 
        name: "Первые шаги", 
        description: "Сделать 100 кликов", 
        condition: () => totalClicks >= 100,
        reward: "+10% к силе клика",
        earned: false,
        effect: () => { clickPower = Math.floor(clickPower * 1.1); }
    },
    2: { 
        name: "Тысячник", 
        description: "Сделать 1,000 кликов", 
        condition: () => totalClicks >= 1000,
        reward: "+20% к силе клика",
        earned: false,
        effect: () => { clickPower = Math.floor(clickPower * 1.2); }
    },
    3: { 
        name: "Автоматизация", 
        description: "Купить первое улучшение", 
        condition: () => Object.values(autoClickers).some(upgrade => upgrade.owned > 0),
        reward: "+5 ко всем автокликерам",
        earned: false,
        effect: () => { 
            for (const key in autoClickers) {
                autoClickers[key].power += 5;
            }
        }
    },
    4: { 
        name: "Богач", 
        description: "Накопить 50,000 кликов", 
        condition: () => clicks >= 50000,
        reward: "Разблокирует рулетку",
        earned: false,
        effect: () => {}
    },
    5: { 
        name: "Скорострел", 
        description: "Достичь 1,000 кликов в секунду", 
        condition: () => cps >= 1000,
        reward: "+50% к скорости автокликеров",
        earned: false,
        effect: () => { 
            for (const key in autoClickers) {
                autoClickers[key].power = Math.floor(autoClickers[key].power * 1.5);
            }
        }
    }
};

// Элементы DOM
const clickerButton = document.getElementById('main-clicker');
const counterDisplay = document.getElementById('counter');
const cpsDisplay = document.querySelector('.cps');
const totalClicksDisplay = document.getElementById('total-clicks');
const totalUpgradesDisplay = document.getElementById('total-upgrades');
const clickPowerDisplay = document.getElementById('click-power');
const achievementsEarnedDisplay = document.getElementById('achievements-earned');
const achievementsTotalDisplay = document.getElementById('achievements-total');
const rouletteSpinsDisplay = document.getElementById('roulette-spins');
const spinButton = document.getElementById('spin-button');
const rouletteResult = document.getElementById('roulette-result');

// Инициализация игры
const initGame = () => {
    loadGame();
    renderClickUpgrades();
    renderAutoUpgrades();
    renderAchievements();
    renderBackgroundOptions();
    updateDisplay();
    
    // Автокликеры
    setInterval(gameTick, 1000);
    
    // Автосохранение каждые 10 секунд
    setInterval(saveGame, 10000);
};

// Игровой цикл
const gameTick = () => {
    let totalAutoClicks = 0;
    for (const key in autoClickers) {
        totalAutoClicks += autoClickers[key].power * autoClickers[key].owned;
    }
    clicks += totalAutoClicks;
    totalClicks += totalAutoClicks;
    cps = totalAutoClicks;
    checkAchievements();
    updateDisplay();
};

// Обработчик клика
clickerButton.addEventListener('click', function() {
    clicks += clickPower;
    totalClicks += clickPower;
    checkAchievements();
    updateDisplay();
});

// Покупка улучшения клика
const buyClickUpgrade = (upgradeId) => {
    const upgrade = clickUpgrades[upgradeId];
    if (clicks >= upgrade.cost) {
        clicks -= upgrade.cost;
        upgrade.owned += 1;
        clickPower += upgrade.power;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        updateDisplay();
        renderClickUpgrades();
        saveGame();
    }
};

// Покупка автокликера
const buyAutoUpgrade = (upgradeId) => {
    const upgrade = autoClickers[upgradeId];
    if (clicks >= upgrade.cost) {
        clicks -= upgrade.cost;
        upgrade.owned += 1;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        updateDisplay();
        renderAutoUpgrades();
        checkAchievements();
        saveGame();
    }
};

// Смена фона
const changeBackground = (bgId) => {
    const bg = backgrounds[bgId];
    if (clicks >= bg.cost && currentBackground !== bgId) {
        if (currentBackground !== 0 || bgId === 0) {
            clicks -= bg.cost;
        }
        currentBackground = bgId;
        updateBackground(bgId);
        updateDisplay();
        saveGame();
    }
};

const updateBackground = (bgId) => {
    document.body.style.backgroundImage = `url('${backgrounds[bgId].image}')`;
};

// Рулетка
spinButton.addEventListener('click', function() {
    if (clicks >= 50000) {
        clicks -= 50000;
        rouletteSpins++;
        
        const rewards = [
            { text: "+10,000 кликов", value: 10000, color: "#4CAF50" },
            { text: "+50,000 кликов", value: 50000, color: "#4CAF50" },
            { text: "+100,000 кликов", value: 100000, color: "#4CAF50" },
            { text: "x2 кликов", value: "multiply", color: "#FFC107" },
            { text: "+1 к силе клика", value: "clickPower", color: "#2196F3" },
            { text: "Удвоение всех автокликеров", value: "doubleAuto", color: "#9C27B0" },
            { text: "Ничего", value: 0, color: "#F44336" }
        ];
        
        const spinDuration = 2000; // 2 секунды анимации
        const startTime = Date.now();
        
        const spinInterval = setInterval(() => {
            const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
            rouletteResult.textContent = randomReward.text;
            rouletteResult.style.color = randomReward.color;
        }, 100);
        
        setTimeout(() => {
            clearInterval(spinInterval);
            const reward = rewards[Math.floor(Math.random() * rewards.length)];
            rouletteResult.textContent = `Результат: ${reward.text}`;
            rouletteResult.style.color = reward.color;
            
            if (typeof reward.value === "number") {
                clicks += reward.value;
            } else if (reward.value === "multiply") {
                clicks *= 2;
            } else if (reward.value === "clickPower") {
                clickPower += 1;
            } else if (reward.value === "doubleAuto") {
                for (const key in autoClickers) {
                    autoClickers[key].power *= 2;
                }
            }
            
            updateDisplay();
            saveGame();
        }, spinDuration);
    }
});

// Проверка достижений
const checkAchievements = () => {
    let earnedCount = 0;
    for (const key in achievements) {
        if (!achievements[key].earned && achievements[key].condition()) {
            achievements[key].earned = true;
            achievements[key].effect();
            achievementsEarned++;
            earnedCount++;
        }
    }
    
    if (earnedCount > 0) {
        renderAchievements();
        // Можно добавить уведомление о получении достижения
    }
};

// Форматирование чисел
const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Обновление отображения
const updateDisplay = () => {
    counterDisplay.textContent = formatNumber(clicks) + ' кликов';
    cpsDisplay.textContent = 'Кликов в секунду: ' + formatNumber(cps);
    totalClicksDisplay.textContent = formatNumber(totalClicks);
    clickPowerDisplay.textContent = formatNumber(clickPower);
    
    // Общее количество улучшений
    let totalUpgrades = 0;
    for (const key in clickUpgrades) {
        totalUpgrades += clickUpgrades[key].owned;
    }
    for (const key in autoClickers) {
        totalUpgrades += autoClickers[key].owned;
    }
    totalUpgradesDisplay.textContent = totalUpgrades;
    
    // Достижения
    achievementsEarnedDisplay.textContent = achievementsEarned;
    achievementsTotalDisplay.textContent = Object.keys(achievements).length;
    
    // Рулетка
    rouletteSpinsDisplay.textContent = rouletteSpins;
    spinButton.disabled = clicks < 50000;
    
    // Обновление кнопок фонов
    const bgOptions = document.querySelectorAll('.background-option');
    bgOptions.forEach((option, index) => {
        option.disabled = clicks < backgrounds[index].cost || currentBackground === index;
    });
};

// Рендер улучшений кликов
const renderClickUpgrades = () => {
    const container = document.getElementById('click-upgrades');
    container.innerHTML = '';
    
    for (const key in clickUpgrades) {
        const upgrade = clickUpgrades[key];
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.innerHTML = `
            <div class="upgrade-title">${upgrade.name}</div>
            <div class="upgrade-power">+${upgrade.power} к клику</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-cost">${formatNumber(upgrade.cost)} кликов</div>
            <div class="upgrade-owned">Куплено: ${upgrade.owned}</div>
        `;
        upgradeElement.onclick = () => buyClickUpgrade(key);
        upgradeElement.disabled = clicks < upgrade.cost;
        container.appendChild(upgradeElement);
    }
};

// Рендер автокликеров
const renderAutoUpgrades = () => {
    const container = document.getElementById('auto-upgrades');
    container.innerHTML = '';
    
    for (const key in autoClickers) {
        const upgrade = autoClickers[key];
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
        upgradeElement.innerHTML = `
            <div class="upgrade-title">${upgrade.name}</div>
            <div class="upgrade-power">+${formatNumber(upgrade.power)} клик/сек</div>
            <div class="upgrade-description">${upgrade.description}</div>
            <div class="upgrade-cost">${formatNumber(upgrade.cost)} кликов</div>
            <div class="upgrade-owned">Куплено: ${upgrade.owned}</div>
        `;
        upgradeElement.onclick = () => buyAutoUpgrade(key);
        upgradeElement.disabled = clicks < upgrade.cost;
        container.appendChild(upgradeElement);
    }
};

// Рендер достижений
const renderAchievements = () => {
    const container = document.getElementById('achievements-list');
    container.innerHTML = '';
    
    for (const key in achievements) {
        const achievement = achievements[key];
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${achievement.earned ? '' : 'locked'}`;
        achievementElement.innerHTML = `
            <div class="achievement-title">${achievement.name}</div>
            <div class="achievement-description">${achievement.description}</div>
            <div class="achievement-reward">Награда: ${achievement.reward}</div>
            ${achievement.earned ? '<div class="achievement-status">Получено!</div>' : ''}
        `;
        container.appendChild(achievementElement);
    }
};

// Рендер опций фона
const renderBackgroundOptions = () => {
    const container = document.querySelector('.background-options');
    container.innerHTML = '';
    
    backgrounds.forEach((bg, index) => {
        if (index === 0) return; // Пропускаем стандартный фон
        
        const option = document.createElement('button');
        option.className = 'background-option';
        option.textContent = `Фон ${index} - ${formatNumber(bg.cost)} кликов`;
        option.onclick = () => changeBackground(index);
        option.disabled = clicks < bg.cost || currentBackground === index;
        container.appendChild(option);
    });
};

// Переключение вкладок
const openTab = (tabName) => {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
};

// Запуск игры при загрузке страницы
window.onload = initGame;