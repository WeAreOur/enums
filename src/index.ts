// Source: https://docs.oracle.com/en/java/javase/23/docs/api/java.base/java/lang/Enum.html
type JavaComparable = {
  compareTo(other: JavaComparable): number;
  ordinal(): number;
};
type JavaSerializable = {
  toString(): string;
};
type JavaEnumMember<K, U> = JavaComparable & JavaSerializable & {
  equals(other: JavaEnumMember<K, U>): boolean;
  name: () => K;
  value: () => U;
}
type JavaEnumClass<T extends readonly string[]> = {
  values: () => T;
};

type EnumMemberType<T, U> = {
  valueOf: () => U;
} & JavaEnumMember<T, U>;
type EnumType<T extends readonly string[], U> = {
  [K in T[number]]: EnumMemberType<K, U>;
} & JavaEnumClass<T> & {
  sort: (values: EnumMemberType<T[number], U>[]) => EnumMemberType<T[number], U>[];
};

const method = { writable: false, enumerable: false } as const;
const enumerable = { writable: false, enumerable: true } as const;

export function Enum<U extends JavaSerializable>(getValue: (key: string, index: number) => U) {
  return <T extends readonly string[]>(values: T) => {
    const obj = {} as EnumType<T, U>;
    Object.defineProperty(obj, 'values', { ...method, value: () => values });
    Object.defineProperty(obj, 'sort', { ...method, value: (values: EnumMemberType<T[number], U>[]) => values.sort((a,z) => a.compareTo(z)) });
    for (const [ordinal, value] of values.entries()) {
      const enumMemberValue = getValue(value, ordinal);
      const enumMember = {} as EnumMemberType<T[number], U>;
      Object.defineProperty(enumMember, 'value', { ...method, value: () => enumMemberValue });
      Object.defineProperty(enumMember, 'valueOf', { ...method, value: () => enumMemberValue });
      Object.defineProperty(enumMember, 'toString', { ...method, value: () => enumMemberValue.toString() });
      Object.defineProperty(enumMember, 'name', { ...method, value: () => value });
      Object.defineProperty(enumMember, 'ordinal', { ...method, value: () => ordinal });
      Object.defineProperty(enumMember, 'compareTo', { ...method, value: (other: EnumMemberType<T[number], U>) => ordinal - other.ordinal() });
      Object.defineProperty(enumMember, 'equals', { ...method, value: (other: EnumMemberType<T[number], U>) => enumMember.value() === other.value() });
      Object.defineProperty(obj, value, { ...enumerable, value: enumMember });
    }
    return obj;
  };
}

// Easy TS enum replacement
export const TsEnum = Enum(Symbol);

// Helper types to extract enum names and members
export type EnumNames<T> = T extends EnumType<infer K, infer V> ? K[number] : never;
export type EnumMembers<T> = T extends EnumType<infer K, infer V> ? T[K[number]] : never;
