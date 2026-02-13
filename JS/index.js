/* ЧИСТЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С МАССИВАМИ */

// 1. Функция для получения только чётных чисел
const getEvenNumbers = (numbers) =>
    numbers.filter(num => num % 2 === 0);


// 2. Функция для получения квадратов чисел
const getSquares = (numbers) =>
    numbers.map(num => num ** 2);


// 3. Функция для фильтрации объектов по наличию свойства
const filterByProperty = (objects, propertyName) =>
    objects.filter(obj => Object.hasOwn(obj, propertyName));


// 4. Функция для вычисления суммы чисел
const getSum = (numbers) =>
    numbers.reduce((sum, num) => sum + num, 0);


// 5. Функция для вычисления среднего арифметического
const getAverage = (numbers) =>
    numbers.length === 0 ? 0 : getSum(numbers) / numbers.length;


/* ФУНКЦИЯ ВЫСШЕГО ПОРЯДКА */

// Применяет переданную функцию к каждому элементу массива
const applyFunctionToArray = (fn, array) =>
    array.map(fn);


/* РЕШЕНИЕ ЗАДАЧ */

// Исходный массив чисел
const numbers = [1, 2, 3, 4, 5, 6];

// Исходный массив объектов
const items = [
    { name: "A", not_value: 10 },
    { name: "B", value: 25 },
    { name: "C", value: 30 },
    { name: "D", value: 5 }
];

const threshold = 15;

// Сумма квадратов всех чётных чисел
const sumOfEvenSquares = (numbers) =>
    getSum(
        getSquares(
            getEvenNumbers(numbers)
        )
    );

// Среднее арифметическое чисел больше заданного значения
const getAverageAboveValue = (objects, property, minValue) => {
    const filteredValues = objects
        .map(obj => obj[property])
        .filter(value => typeof value === "number" && value > minValue);

    return getAverage(filteredValues);
};


/* ДЕМОНСТРАЦИЯ РАБОТЫ */

console.log("Исходный массив чисел:", numbers);

console.log("Четные числа:",
    getEvenNumbers(numbers)
);

console.log("Квадраты чисел:",
    getSquares(numbers)
);

console.log("Сумма чисел:",
    getSum(numbers)
);

console.log("Сумма квадратов четных чисел:",
    sumOfEvenSquares(numbers)
);

console.log("Объекты с полем value:",
    filterByProperty(items, "value")
);

console.log("Объекты с средним value больше 15",
    getAverageAboveValue(items, "value", threshold)
);

// Пример функции высшего порядка
const power = x => x ** 2;

console.log("Применение функции высшего порядка (возведение во 2ю степень):",
    applyFunctionToArray(power, numbers)
);
