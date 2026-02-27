type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt' | 'percent' | null;

interface CalculatorState {
    displayValue: string;
    expression: string;
    firstOperand: number | null;
    operation: Operation;
    waitingForSecondOperand: boolean;
    lastError: string | null;
    dialValues: [number, number, number, number];
}

// Начальное состояние
const initialState: CalculatorState = {
    displayValue: '0',
    expression: '0',
    firstOperand: null,
    operation: null,
    waitingForSecondOperand: false,
    lastError: null,
    dialValues: [0, 0, 0, 0]
};

// Текущее состояние
let state: CalculatorState = { ...initialState };

// Константы
const DIAL_COUNT = 4;

// Символы операций для отображения
const operationSymbols: Record<string, string> = {
    'add': '+',
    'subtract': '-',
    'multiply': '×',
    'divide': '÷',
    'power': '^',
    'sqrt': '√',
    'percent': '%'
};

// Проверка на слишком большое число
const isNumberTooBig = (num: number): boolean => {
    return Math.abs(num) > 1e12 || Math.abs(num) < 1e-12 && num !== 0; // Слишком большое или слишком маленькое
};

// Получение числа из дисков
const getNumberFromDials = (dials: [number, number, number, number]): number => {
    return dials[0] * 1000 + dials[1] * 100 + dials[2] * 10 + dials[3];
};

// Обновление значения диска (с прокруткой)
const rotateDial = (dials: [number, number, number, number], position: number, direction: 1 | -1): [number, number, number, number] => {
    const newDials = [...dials] as [number, number, number, number];
    let newValue = newDials[position] + direction;

    // Зацикливание от 0 до 9
    if (newValue > 9) newValue = 0;
    if (newValue < 0) newValue = 9;

    newDials[position] = newValue;
    return newDials;
};

// Математические операции (чистые функции)
const add = (a: number, b: number): number => a + b;
const subtract = (a: number, b: number): number => a - b;
const multiply = (a: number, b: number): number => a * b;
const divide = (a: number, b: number): number | string => {
    if (b === 0) return 'error';
    return a / b;
};
const power = (a: number, b: number): number => Math.pow(a, b);
const sqrt = (a: number): number | string => {
    if (a < 0) return 'error';
    return Math.sqrt(a);
};
const percent = (a: number): number => a / 100;

// Функция высшего порядка для выполнения операций
const calculate = (
    first: number,
    second: number,
    operation: Operation
): number | string => {
    if (!operation) return second;

    switch(operation) {
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
const getFunnyError = (errorType: string): string => {
    const errors: Record<string, string[]> = {
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
const playSound = (soundName: 'click' | 'error' | 'success' | 'rotate'): void => {
    try {
        const audio = new Audio(`sounds/${soundName}.mp3`);
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Аудио не загрузилось'));
    } catch (e) {
        console.log('Аудио не поддерживается');
    }
};

// Обновление отображения дисков
const updateDialDisplays = (dials: [number, number, number, number]): void => {
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
                (numbersElement as HTMLElement).style.transform = `rotate(${rotation}deg)`;
            }

            // Добавляем класс для анимации щелчка
            dialElement.classList.add('dial-click');
            setTimeout(() => dialElement.classList.remove('dial-click'), 100);
        }
    }
};

// Обновление дисплея
const updateDisplay = (value: string): void => {
    const display = document.getElementById('expression');
    if (display) {
        display.textContent = value;
    }
};

// Показ сообщения об ошибке
const showError = (message: string): void => {
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
const clearError = (): void => {
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
                state = { ...state, dialValues: newDials };

                updateDialDisplays(state.dialValues);
            });

            // Клик правой кнопкой - уменьшение
            dial.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                playSound('rotate');

                const newDials = rotateDial(state.dialValues, i, -1);
                state = { ...state, dialValues: newDials };

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
                state = {
                    ...state,
                    displayValue: number.toString(),
                    expression: state.expression + ' ' + number.toString(),
                    waitingForSecondOperand: false
                };
            } else if (state.operation === null) {
                // Если нет операции - просто число
                state = {
                    ...state,
                    displayValue: number.toString(),
                    expression: number.toString()
                };
            } else {
                // Есть операция, но мы не ждем второе число (пользователь ввел новое число вместо продолжения)
                // Заменяем выражение на новое число (сбрасываем)
                state = {
                    ...state,
                    displayValue: number.toString(),
                    firstOperand: number,
                    operation: null,
                    waitingForSecondOperand: false,
                    expression: number.toString()
                };
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
            const target = e.target as HTMLElement;
            const op = target.dataset.op as Operation;

            const currentValue = parseFloat(state.displayValue);

            if (op === 'sqrt') {
                // Унарная операция
                const result = sqrt(currentValue);
                if (typeof result === 'string') {
                    showError(getFunnyError('negativeSqrt'));
                } else {
                    state = {
                        ...state,
                        displayValue: result.toString(),
                        expression: `${operationSymbols[op]}(${currentValue}) = ${result}`,
                        firstOperand: null,
                        operation: null,
                        waitingForSecondOperand: false
                    };
                    updateDisplay(state.expression);
                    playSound('success');
                }
            } else if (op === 'percent') {
                // Унарная операция
                const result = percent(currentValue);
                state = {
                    ...state,
                    displayValue: result.toString(),
                    expression: `${currentValue}${operationSymbols[op]} = ${result}`,
                    firstOperand: null,
                    operation: null,
                    waitingForSecondOperand: false
                };
                updateDisplay(state.expression);
                playSound('success');
            } else {
                // Бинарная операция
                if (!op) return; // Добавить эту проверку

                state = {
                    ...state,
                    firstOperand: currentValue,
                    operation: op,
                    waitingForSecondOperand: true,
                    expression: currentValue.toString() + ' ' + operationSymbols[op]
                };
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
                } else if (isNaN(result) || !isFinite(result) || isNumberTooBig(result)) {
                    showError(getFunnyError('tooBig'));
                } else {
                    state = {
                        ...state,
                        displayValue: result.toString(),
                        expression: state.firstOperand + ' ' + operationSymbols[state.operation] + ' ' + secondValue + ' = ' + result,
                        firstOperand: null,
                        operation: null,
                        waitingForSecondOperand: false
                    };
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
            state = { ...initialState };
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