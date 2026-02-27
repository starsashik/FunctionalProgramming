// Функция для задания 1.1
export const getMultiples = (
    numbers: number[],
    x: number
): number[] =>
    numbers.filter((num) => num % x === 0);

// Функция для задания 1.2
export const joinStrings = (
    strings: string[],
    separator: string
): string =>
    strings.join(separator);

// Функция для задания 1.3
export const sortByProperty  = <
    T,
    K extends keyof T
>(
    items: T[],
    sortProperty: K,
    reverse: boolean = false
): T[] =>
    [...items].sort((a, b) => {
        const valueA = a[sortProperty];
        const valueB = b[sortProperty];

        if (typeof valueA === "number" && typeof valueB === "number") {
            return reverse ? valueB - valueA : valueA - valueB;
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
            return reverse
                ? valueB.localeCompare(valueA)
                : valueA.localeCompare(valueB);
        }

        if (valueA instanceof Date && valueB instanceof Date) {
            return reverse
                ? valueB.getTime() - valueA.getTime()
                : valueA.getTime() - valueB.getTime();
        }

        // Для других типов сравниваем как строки
        const strA = String(valueA);
        const strB = String(valueB);
        return reverse
            ? strB.localeCompare(strA)
            : strA.localeCompare(strB);
    });

// Функция для задания 2.1
export const addLogging = <
    T extends (...args: any[]) => any
>(
    func: T,
    loggerFunc: (message: string) => void = console.log
): T => {
    const newFunc = (...args: Parameters<T>): ReturnType<T> => {
        try {
            loggerFunc(
                `Начало функции ${func.name} со следующими аргументами: ${JSON.stringify(args)}`
            );

            const result = func(...args);

            loggerFunc(
                `Функция ${func.name} выполнена успешно со следующим результатом: ${JSON.stringify(result)}`
            );

            return result;
        } catch (error) {
            const errorMessage =
                    error instanceof Error ? error.message : String(error);

            loggerFunc(
                `Функция ${func.name} была прервана со следующей ошибкой: ${errorMessage}`
            );

            throw error;
        }
    };

    return newFunc as T;
};

// Класс для демонстрации сортировки
class Person {
    public Name: string;
    public Age: number;
    public constructor(name: string, age: number) {
        this.Name = name;
        this.Age = age;
    }
}

// Класс для демонстрации сортировки по датам
class Task {
    public Title: string;
    public Deadline: Date;
    public Priority: number;
    public constructor(title: string, deadline: Date, priority: number) {
        this.Title = title;
        this.Deadline = deadline;
        this.Priority = priority;
    }
}

// Демонстрация работы функций
function main(): void {
    console.log("ТЕСТ 1: Функция getMultiples (поиск кратных чисел)");

    console.log("\nПример 1.1: кратных 3:");
    console.log("Массив: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]");
    console.log("Результат:", getMultiples([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 3));

    console.log("\nПример 1.2: кратных 5 (с отрицательными):");
    console.log("Массив: [-15, -10, -5, 0, 5, 10, 15, 17, 18]");
    console.log("Результат:", getMultiples([-15, -10, -5, 0, 5, 10, 15, 17, 18], 5));

    console.log("\nПример 1.3: кратных 7 (пустой результат):");
    console.log("Массив: [1, 2, 3, 4, 5, 6]");
    console.log("Результат:", getMultiples([1, 2, 3, 4, 5, 6], 7));

    console.log("\nПример 1.4: кратных 2:");
    console.log("Массив: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]");
    console.log("Результат:", getMultiples([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2));

    console.log("\n\nТЕСТ 2: Функция joinStrings (объединение строк)");

    console.log("\nПример 2.1: с разделителем ' - ':");
    console.log("Массив: [\"qwertyuiop\", \"asdfghjkl\", \"zxcvbnm\", \"1234567890\"]");
    console.log("Результат:", joinStrings(["qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890"], " - "));

    console.log("\nПример 2.2: с разделителем ', ':");
    console.log("Массив: [\"яблоко\", \"банан\", \"апельсин\", \"груша\"]");
    console.log("Результат:", joinStrings(["яблоко", "банан", "апельсин", "груша"], ", "));

    console.log("\nПример 2.3: с пустым разделителем:");
    console.log("Массив: [\"H\", \"e\", \"l\", \"l\", \"o\"]");
    console.log("Результат:", joinStrings(["H", "e", "l", "l", "o"], ""));

    console.log("\nПример 2.4: с разделителем ' | ':");
    console.log("Массив: [\"Красный\", \"Синий\", \"Зеленый\"]");
    console.log("Результат:", joinStrings(["Красный", "Синий", "Зеленый"], " | "));

    console.log("\nПример 2.5: Объединение одного элемента:");
    console.log("Массив: [\"только один элемент\"]");
    console.log("Результат:", joinStrings(["только один элемент"], " --- "));

    console.log("\n\nТЕСТ 3: Функция sortByProperty (сортировка объектов)");

    const people = [
        new Person("Олег", 20),
        new Person("Владимир", 22),
        new Person("Мария", 21),
        new Person("Анна", 19),
        new Person("Дмитрий", 25)
    ];
    console.log(`Исходный массив: ${JSON.stringify(people)}`);

    console.log("\nПример 3.1: Сортировка людей по имени (по возрастанию):");
    const sortedByName = sortByProperty(people, "Name", false);
    console.log(`Результат: ${JSON.stringify(sortedByName)}`);

    console.log("\nПример 3.2: Сортировка людей по возрасту (по убыванию):");
    const sortedByAgeDesc = sortByProperty(people, "Age", true);
    console.log(`Результат:${JSON.stringify(sortedByAgeDesc)}`);

    console.log("\nПример 3.3: Сортировка по возрасту (по возрастанию):");
    const sortedByAgeAsc = sortByProperty(people, "Age", false);
    console.log(`Результат: ${JSON.stringify(sortedByAgeAsc)}`);

    console.log("\nПроверка иммутабельности (оригинал не изменился):");
    console.log(`Оригинальный массив после сортировок: ${JSON.stringify(people)}`);

    console.log("\n\nТЕСТ 4: sortByProperty часть 2");

    const tasks = [
        new Task("Сделать ФП", new Date("2026-02-27"), 2),
        new Task("Сделать ЦМОИ", new Date("2026-02-28"), 3),
        new Task("Сделать АД", new Date("2026-03-01"), 4),
        new Task("Сделать ИБИЗИ", new Date("2026-02-24"), 1)
    ];
    console.log(`Задачи до сортировки: ${JSON.stringify(tasks)}`);

    console.log("\nПример 4.1: Сортировка задач по приоритету (числа):");
    const sortedByPriority = sortByProperty(tasks, "Priority", false);
    console.log(`Результат: ${JSON.stringify(sortedByPriority)}`);

    console.log("\nПример 4.2: Сортировка задач по дедлайну (дата):");
    const sortedByDeadline = sortByProperty(tasks, "Deadline", false);
    console.log(`Результат: ${JSON.stringify(sortedByDeadline)}`);

    console.log("\n\nТЕСТ 5: Функция addLogging");

    const FilterMultiplesWithLogging = addLogging(getMultiples, console.log);
    const JoinStringListWithLogging = addLogging(joinStrings);
    const SortByPropertyWithLogging = addLogging(sortByProperty );

    console.log(FilterMultiplesWithLogging(
        [92, 20, 340, 55, 11, 10, 2, 4, 5, 8, 4, 35],
        5));
    console.log()

    console.log(
        JoinStringListWithLogging(
            ["Лубенец", "Александр", "231-333"],
            ":"));
    console.log()

    console.log(
        SortByPropertyWithLogging(
            [new Person("Alexander", 21), new Person("Matvey", 20), new
            Person("Darya", 19)],
            "Age",
            false));
}

main();