# enums

TS implementation of an enum

## Install

```bash
npm install github:WeAreOur/enums#main
```

> [!NOTE]
> Replace `#main` with the commit (example `#1c2f289`) as this is the version control

## Migrating away from `enum`

If you are migrating away from using `enum` in TypeScript, this library makes it super simple.

The enum definition:

```ts
export enum Colors { RED, GREEN, BLUE }
```
update it to:
```ts
import { TsEnum, type EnumMembers } from '@weareour/enums';

export const Colors = TsEnum(['RED', 'GREEN', 'BLUE'] as const);
export type ColorsEnum = EnumMembers<typeof Colors>;
```

Then search for the uses of the enum as a type `: Colors` and replace with:
```ts
  color: ColorsEnum,
```
There's also a type to extract the names if you need them:
```ts
export type ColorNames = EnumNames<typeof Colors>;
```

Then search for the usage `Colors[` like:
```ts
Colors[Colors.RED] // Returns 'RED'
```
and replace with:
```ts
Colors.RED.name() // Returns 'RED'
```
And for the usage inside `for` loops:
```ts
for (const color in Colors) { // color is 'RED'
  Colors[color] // Returns 0
```
replace with:
```ts
for (const color of Colors.values()) { // color is 'RED'
  Colors[color].ordinal() // Returns 0
```

Finally, if you manage to not have any usage of `.name()` or `.ordinal()`, then you don't need this library at all. Just add `Symbol()` as the value for all your keys to guarantee uniqueness.

```ts
const S = Symbol;
export const Colors = { RED: S(), GREEN: S(), BLUE: S() } as const;
```

## Intended Usage

- To smooth a TS migration removing `enum`
- When you want to do weird object-as-array things

Create a util like:
```ts
// @/utils/enums.ts
import { Enum } from '@weareour/enums';
// AND DEFINE HOW TO GENERATE YOUR VALUES

// For example, Symbols are always unique
export const symbolicEnum = Enum(Symbol);
// But you could define them as lowercase string values
export const lcEnum = Enum(key => key.toLowerCase());
// Or to UUIDs
export const uuidEnum = Enum(() => crypto.randomUUID());
// The control is yours
```

Whenever in need:
```ts
// Define your Enum
export const WEEKDAY = lcEnum([
  'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
] as const);
```
Then you can do the same as with an object defined as `{ MONDAY: 'monday' } as const`:
```ts
// You can select those strings as keys
const day = WEEKDAY.MONDAY;
// Use them in switch statements
switch(day) { case WEEKDAY.MONDAY: }
// If statements
if (day === WEEKDAY.MONDAY)
// And they are weakly equal to the matching string
if (day == 'monday')
```
And you can also access the awkward array-like operations of an Enum:
```ts
// Position retrieval from enum
const position = day.ordinal() // 1
// Key retrieval from position
WEEKDAY.values().at(position) // 'MONDAY'
// Iterating the enum
for(const weekday of WEEKDAY.values())
// Comparing
WEEKDAY.FRIDAY.compareTo(day) // 4
// Sorting
WEEKDAY.sort([WEEKDAY.FRIDAY, day]) // [MONDAY, FRIDAY]
```
I didn't want to be creative, so I copied the API from Java. Sorry if it's different from your current TS `enum`.

## Unintended usage

- When you want to stick to JS standards

TypeScript already provides everything you need.

```typescript
export const MyEnum = {
  KEY: 'value'
} as const;
export type MyEnumMembers = typeof MyEnum[keyof typeof MyEnum];
```

This allows you to set arguments expecting `MyEnumMembers` to be set as `MyEnum.KEY`
