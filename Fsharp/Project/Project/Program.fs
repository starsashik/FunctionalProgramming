open System

// Набор чистых функций для выполнения общих математических операций

// Функция, которая принимает два числа и возвращает их сумму.
let add (x: double) (y: double) : double = x + y
// Функция, которая принимает два числа и возвращает их разность.
let subtract (x: double) (y: double) : double = x - y
// Функция, которая принимает два числа и возвращает их произведение.
let multiply (x: double) (y: double) : double = x * y
// Функция, которая принимает два числа и возвращает результат деления.
let divide (x: double) (y: double) : double =
    if y = 0 then failwith "Division by zero" else x / y

// Каррирование - создание специализированных функций
let addSixSeven = add 67
let multiplyByFiftyTwo = multiply 52
let half = fun x -> divide x 2.0

// Рекурсивная функция для вычисления факториала
let rec factorial (n: int) : int =
    if n < 0 then failwith "n must >= 0"
    elif n = 0 || n = 1 then 1
    else n * factorial (n - 1)

[<EntryPoint>]
let main (argv: string[]) : int =
    Console.WriteLine($"Сумма 3 и 4: {add 3 4}")
    Console.WriteLine($"Разность 10 и 7: {subtract 10 7}")
    Console.WriteLine($"Произведение 5 и 6: {multiply 5 6}")
    Console.WriteLine($"Деление 10 на 4: {divide 10 4}")
    Console.WriteLine($"Add 67 to 10: {addSixSeven 10}")
    Console.WriteLine($"Multiply 7 by 52: {multiplyByFiftyTwo 7}")
    Console.WriteLine($"Факториал 5: {factorial 5}")
    Console.WriteLine("---")

    Console.WriteLine($"Сумма -5 и 3: {add -5.0 3.0}")
    Console.WriteLine($"Разность -10 и -4: {subtract -10.0 -4.0}")
    Console.WriteLine($"Произведение -2 и 6: {multiply -2.0 6.0}")
    Console.WriteLine($"Деление -15 на 3: {divide -15.0 3.0}")
    Console.WriteLine("---")

    Console.WriteLine($"Сумма 2.5 и 1.3: {add 2.5 1.3}")
    Console.WriteLine($"Разность 7.8 и 2.2: {subtract 7.8 2.2}")
    Console.WriteLine($"Произведение 3.3 и 2: {multiply 3.3 2.0}")
    Console.WriteLine($"Деление 10.5 на 2.5: {divide 10.5 2.5}")
    Console.WriteLine("---")

    Console.WriteLine($"addSixSeven 20: {addSixSeven 20.0}")
    Console.WriteLine($"addSixSeven -5: {addSixSeven -5.0}")
    Console.WriteLine($"multiplyByFiftyTwo 3: {multiplyByFiftyTwo 3.0}")
    Console.WriteLine($"multiplyByFiftyTwo 0.5: {multiplyByFiftyTwo 0.5}")
    Console.WriteLine($"half 8: {half 8.0}")
    Console.WriteLine($"half 3.14: {half 3.14}")
    Console.WriteLine("---")

    Console.WriteLine($"Факториал 0: {factorial 0}")
    Console.WriteLine($"Факториал 1: {factorial 1}")
    Console.WriteLine($"Факториал 10: {factorial 10}")
    Console.WriteLine($"Факториал 12: {factorial 12}")
    Console.WriteLine("---")


    try
        Console.WriteLine($"Деление на ноль: {divide 10.0 0.0}")
    with ex ->
        Console.WriteLine($"Ошибка при делении на ноль: {ex.Message}")

    try
        Console.WriteLine($"Факториал отрицательного числа: {factorial -3}")
    with ex ->
        Console.WriteLine($"Ошибка при факториале отрицательного числа: {ex.Message}")

    0
