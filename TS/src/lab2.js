// Начальное состояние
const initialState = {
    displayValue: '0',
    expression: '0',
    firstOperand: null,
    operation: null,
    waitingForSecondOperand: false,
    lastError: null,
    dialValues: [0, 0, 0, 0]
};
// Текущее состояние
let state = Object.assign({}, initialState);
// Константы
const DIAL_COUNT = 4;
// Символы операций для отображения
const operationSymbols = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷',
    'power': '^',
    'sqrt': '√',
    'percent': '%'
};
// Проверка на слишком большое число
const isNumberTooBig = (num) => {
    return Math.abs(num) > 1e12 || Math.abs(num) < 1e-12 && num !== 0; // Слишком большое или слишком маленькое
};
// Получение числа из дисков
const getNumberFromDials = (dials) => {
    return dials[0] * 1000 + dials[1] * 100 + dials[2] * 10 + dials[3];
};
// Обновление значения диска (с прокруткой)
const rotateDial = (dials, position, direction) => {
    const newDials = [...dials];
    let newValue = newDials[position] + direction;
    // Зацикливание от 0 до 9
    if (newValue > 9)
        newValue = 0;
    if (newValue < 0)
        newValue = 9;
    newDials[position] = newValue;
    return newDials;
};
// Математические операции (чистые функции)
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0)
        return 'error';
    return a / b;
};
const power = (a, b) => Math.pow(a, b);
const sqrt = (a) => {
    if (a < 0)
        return 'error';
    return Math.sqrt(a);
};
const percent = (a) => a / 100;
// Функция высшего порядка для выполнения операций
const calculate = (first, second, operation) => {
    if (!operation)
        return second;
    switch (operation) {
        case 'add': return add(first, second);
        case 'subtract': return subtract(first, second);
        case 'multiply': return multiply(first, second);
        case 'divide': return divide(first, second);
        case 'power': return power(first, second);
        case 'percent': return percent(first);
        default: return second;
    }
};
// Смешные сообщения для ошибок
const getFunnyError = (errorType) => {
    const errors = {
        divideByZero: [
            'ЭЙ! НА НОЛЬ НЕ ДЕЛЯТ!',
            'ТЫ ЧЕ, ДУРАЧОК?',
            'СОВСЕМ КУ-КУ? НА НОЛЬ НИ-НИ!',
            'ОЙ, ВСЁ! НА НОЛЬ НЕЛЬЗЯ!'
        ],
        negativeSqrt: [
            'КОРЕНЬ ИЗ МИНУСА? ТЫ В КАКОМ КЛАССЕ?',
            'ЭТО ЖЕ МНИМЫЕ ЧИСЛА',
            'НЕ БУДУ Я ЭТО СЧИТАТЬ!'
        ],
        tooBig: [
            'ОГО! ЧИСЛО СЛИШКОМ БОЛЬШОЕ',
            'ЭТО УЖЕ НЕ ВЛЕЗАЕТ В МОЙ КАЛЬКУЛЯТОР',
            'ЧИСЛО СЛИШКОМ БОЛЬШОЕ',
            'НЕ ВЛЕЗАЕТ В ЭКРАН',
            '12 ЦИФР - МАКСИМУМ!',
            'ЭТО УЖЕ ПЕРЕБОР'
        ]
    };
    const list = errors[errorType] || ['ЧТО-ТО ПОШЛО НЕ ТАК'];
    return list[Math.floor(Math.random() * list.length)];
};
// Воспроизведение звука
const playSound = (soundName) => {
    try {
        const audio = new Audio(`sounds/${soundName}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Аудио не загрузилось'));
    }
    catch (e) {
        console.log('Аудио не поддерживается');
    }
};
// Обновление отображения дисков
const updateDialDisplays = (dials) => {
    for (let i = 0; i < DIAL_COUNT; i++) {
        // Обновляем цифру под диском
        const valueElement = document.getElementById(`dialValue${i + 1}`);
        if (valueElement) {
            valueElement.textContent = dials[i].toString();
        }
        // Поворачиваем цифры на диске
        const dialElement = document.getElementById(`dial${i + 1}`);
        if (dialElement) {
            const numbersElement = dialElement.querySelector('.dial-numbers');
            if (numbersElement) {
                const rotation = dials[i] * -36;
                numbersElement.style.transform = `rotate(${rotation}deg)`;
            }
            // Добавляем класс для анимации щелчка
            dialElement.classList.add('dial-click');
            setTimeout(() => dialElement.classList.remove('dial-click'), 100);
        }
    }
};
// Обновление дисплея
const updateDisplay = (value) => {
    const display = document.getElementById('expression');
    if (display) {
        display.textContent = value;
    }
};
// Показ сообщения об ошибке
const showError = (message) => {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('error-shake');
        setTimeout(() => errorElement.classList.remove('error-shake'), 500);
    }
    // Обновляем цитату в снизу
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
        quoteElement.textContent = `"${message}"`;
    }
    playSound('error');
};
// Очистка ошибки
const clearError = () => {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = '';
    }
};
// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    console.log('Калькулятор готов к работе!');
    // Начальное обновление дисплеев
    updateDialDisplays(state.dialValues);
    updateDisplay('0');
    // Добавляем обработчики для дисков
    for (let i = 0; i < DIAL_COUNT; i++) {
        const dial = document.getElementById(`dial${i + 1}`);
        if (dial) {
            // Клик левой кнопкой - увеличение
            dial.addEventListener('click', (e) => {
                e.preventDefault();
                playSound('rotate');
                // Создаем новое состояние (иммутабельно)
                const newDials = rotateDial(state.dialValues, i, 1);
                state = Object.assign(Object.assign({}, state), { dialValues: newDials });
                updateDialDisplays(state.dialValues);
            });
            // Клик правой кнопкой - уменьшение
            dial.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                playSound('rotate');
                const newDials = rotateDial(state.dialValues, i, -1);
                state = Object.assign(Object.assign({}, state), { dialValues: newDials });
                updateDialDisplays(state.dialValues);
            });
        }
    }
    // Кнопка ввода числа
    const enterBtn = document.getElementById('enterNumber');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            const number = getNumberFromDials(state.dialValues);
            if (state.waitingForSecondOperand) {
                // Если ждем второе число - добавляем справа
                state = Object.assign(Object.assign({}, state), { displayValue: number.toString(), expression: state.expression + ' ' + number.toString(), waitingForSecondOperand: false });
            }
            else if (state.operation === null) {
                // Если нет операции - просто число
                state = Object.assign(Object.assign({}, state), { displayValue: number.toString(), expression: number.toString() });
            }
            else {
                // Есть операция, но мы не ждем второе число (пользователь ввел новое число вместо продолжения)
                // Заменяем выражение на новое число (сбрасываем)
                state = Object.assign(Object.assign({}, state), { displayValue: number.toString(), firstOperand: number, operation: null, waitingForSecondOperand: false, expression: number.toString() });
            }
            updateDisplay(state.expression);
            clearError();
            playSound('click');
        });
    }
    // Кнопки операций
    const opButtons = document.querySelectorAll('.op-btn');
    opButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const target = e.target;
            const op = target.dataset.op;
            const currentValue = parseFloat(state.displayValue);
            if (op === 'sqrt') {
                // Унарная операция
                const result = sqrt(currentValue);
                if (typeof result === 'string') {
                    showError(getFunnyError('negativeSqrt'));
                }
                else {
                    state = Object.assign(Object.assign({}, state), { displayValue: result.toString(), expression: `${operationSymbols[op]}(${currentValue}) = ${result}`, firstOperand: null, operation: null, waitingForSecondOperand: false });
                    updateDisplay(state.expression);
                    playSound('success');
                }
            }
            else if (op === 'percent') {
                // Унарная операция
                const result = percent(currentValue);
                state = Object.assign(Object.assign({}, state), { displayValue: result.toString(), expression: `${currentValue}${operationSymbols[op]} = ${result}`, firstOperand: null, operation: null, waitingForSecondOperand: false });
                updateDisplay(state.expression);
                playSound('success');
            }
            else {
                // Бинарная операция
                if (!op)
                    return; // Добавить эту проверку
                state = Object.assign(Object.assign({}, state), { firstOperand: currentValue, operation: op, waitingForSecondOperand: true, expression: currentValue.toString() + ' ' + operationSymbols[op] });
                updateDisplay(state.expression);
                playSound('click');
            }
        });
    });
    // Кнопка вычисления
    const calculateBtn = document.getElementById('calculate');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            if (state.firstOperand !== null && state.operation) {
                const secondValue = parseFloat(state.displayValue);
                const result = calculate(state.firstOperand, secondValue, state.operation);
                if (typeof result === 'string') {
                    showError(getFunnyError('divideByZero'));
                }
                else if (isNaN(result) || !isFinite(result) || isNumberTooBig(result)) {
                    showError(getFunnyError('tooBig'));
                }
                else {
                    state = Object.assign(Object.assign({}, state), { displayValue: result.toString(), expression: state.firstOperand + ' ' + operationSymbols[state.operation] + ' ' + secondValue + ' = ' + result, firstOperand: null, operation: null, waitingForSecondOperand: false });
                    updateDisplay(state.expression);
                    playSound('success');
                    const quotes = ['ТОЧНО!', 'МЕТКО!', 'ЗОЛОТО!', 'ОТЛИЧНО!'];
                    const quoteElement = document.getElementById('quote');
                    if (quoteElement) {
                        quoteElement.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
                    }
                }
            }
        });
    }
    // Кнопка сброса
    const resetBtn = document.getElementById('reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state = Object.assign({}, initialState);
            updateDialDisplays(state.dialValues);
            updateDisplay('0');
            clearError();
            const quoteElement = document.getElementById('quote');
            if (quoteElement) {
                quoteElement.textContent = '"ВВЕДИ ЧИСЛО"';
            }
            playSound('click');
        });
    }
});
