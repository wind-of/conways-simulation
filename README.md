# Симуляция

### Установка зависимостей:
```
npm install
```

### Запуск проекта:
```
npm run start
```

### Демонстрация
- [demo](https://ddl2zj-1234.csb.app/)
- [source](https://codesandbox.io/p/github/wind-of/game-of-life/master?workspaceId=47eff916-419c-40d7-a601-0531e3f65336)


### Руководство
Настройки симуляции по умолчанию:
 - Размер: **50x50 [2500 клеток]**;
 - Итерации в секунду: **100**;
 - Итерации за тик: **1**;
 - Near: **0.1**;
 - Far: **10000**;
 - Правила: **S23B3**;
Все эти настройки можно вручную менять в `src/js/constants.js`. Правило по умолчанию задаётся в функции `defaultRulesFunction` в `src/js/life/rules.js`.

Описание GUI:
- **Общее**
	- **On/Off** (переключает режим симуляции)
	- **Очистить поле** (очищает поле)
	- **Скопировать поле [с сжатием]** (транслирует матрицу всего поля в строку и сохраняет в буфер обмена)
	- **Скопировать поле [без сжатия]** (транслирует минимально необходимую матрицу - необязательно квадратную -, содержащая все необходимые клетки, в строку и сохраняет в буфер обмена)
- **Настройки симуляции**
	- **Итерации в секунду** (количество тиков в секунду)
	- **Итерации за тик** (количество итераций за тик)
	- **Правило** (список доступных правил)
		- **[RULE_NAME]** (по каким правилам вычисляется жизнь и смерть клеток)
- **Шаблоны** (список доступных шаблонов)
	- **[TEMPLATE_NAME]** (шаблон подсказки)
- **Режимы**
	- **Инверсирование** (вместо живой клетки шаблона подставляется мёртвая, а вместо мёртвой - живая)
	- **Оживление** (клетки, соответствующие живым клеткам шаблона, оживают)
	- **Уничтожение** (клетки, соответствующие живым клеткам шаблона, умирают)

#### Добавление пользовательских правил
Для добавления нового правила необходимо дополнить объект `rules` в `src/js/life/rules.js` объектом следующего формата:
```typescript
interface Rule {
	name: String,
	stay: Array<number>,
	birth: Array<number>
}
```
При этом ключ в объекте должен быть таким же, как и `Rule.name`. Например:
``` javascript
{
	// ...
	[RULE_S245B368]: {
		name: RULE_S245B368,
		stay: [2, 4, 5],
		birth: [3, 6, 8]
	},
	// ...
}
```

#### Добавление пользовательских шаблонов
Для добавления нового шаблона необходимо дополнить объект `templates` в `src/js/life/templates.js` объектом следующего формата:
```typescript
interface HintTemplate {
	name: String,    // Внутреннее название правила
	guiName: String, // Название правила, которое будет выводиться в GUI
	string: String,  // Строка, представляющая из себя сжатую матрицу [результат копирования поля в GUI]. Состоит из цифр и символов o, b, $ и !
	width: Number,   // Ширина шаблона
	height: Number   // Высота шаблона
}
```
При этом ключ в объекте должен быть таким же, как и `HintTemplate.name`. Например:
``` javascript
{
	// ...
	[DOT]: {
		name: DOT,
		guiName: "Точка",
		string: "o!",
		width: 1,
		height: 1
	},
	// ...
}
```
ВАЖНО: пока что нет поддержки неквадратных матриц. Необходимо, чтобы `width` и `height` совпадали.

#### Формат сжатия матрицы
Матрица сжимается в строку по следующему алгоритму:
```
encodeMatrixToString (
· · 
·  ·
·
) == "2o$obo$o!" // все неуказанные клетки считаются мёртвыми
```
- Символ `o` соответствует живой клетке, а число перед ним указывает на их количество.
- Символ `b` соответсвует мёртвой клетке, а число перед ним указывает на их количество.
- Символ `$` соответствует началу строку.
- Символ `!` соответствует концу строку шаблона.


### Todo:
- Добавить больше шаблонов (!!!low)
- Добавить возможность добавлять пользовательские шаблоны (!!medium)
- Добавить возможность экспортировать отдельные участки поля (!!!low)
- Возможность создавать неквадратное поле (!high)
- Рассмотреть использование Worker-а для оптимизации (optimization)

### Fix:
- Сетка не подстраивается под длину и высоту клеток (cells.js) (!!!low)