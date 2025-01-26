// Source: https://docs.oracle.com/en/java/javase/23/docs/api/java.base/java/lang/Enum.html
type JavaComparable = {
  compareTo(other: JavaComparable): number;
  ordinal(): number;
};
type JavaSerializable = {
  toString(): string;
};
type JavaEnumMember<U> = JavaComparable & JavaSerializable & {
  equals(other: JavaEnumMember<U>): boolean;
  value: () => U;
}
type JavaEnumClass<T extends readonly string[]> = {
  values: () => T;
};

type EnumMemberType<U> = U & JavaEnumMember<U>;
type EnumType<T extends readonly string[], U> = {
  [K in T[number]]: EnumMemberType<U>;
} & JavaEnumClass<T> & {
  sort: (values: EnumMemberType<U>[]) => EnumMemberType<U>[];
};

const method = { writable: false, enumerable: false } as const;
const enumerable = { writable: false, enumerable: true } as const;

export function Enum<U extends JavaSerializable>(getValue: (key: string) => U) {
  return <T extends readonly string[]>(values: T) => {
    const obj = {} as EnumType<T, U>;
    Object.defineProperty(obj, 'values', { ...method, value: () => values });
    Object.defineProperty(obj, 'sort', { ...method, value: (values: EnumMemberType<U>[]) => values.sort((a,z) => a.compareTo(z)) });
    for (const [ordinal, value] of values.entries()) {
      const enumMemberValue = getValue(value);
      const enumMember = {
        value: () => enumMemberValue,
        toString: () => enumMemberValue.toString(),
      } as EnumMemberType<U>;
      Object.defineProperty(enumMember, 'ordinal', { ...method, value: () => ordinal });
      Object.defineProperty(enumMember, 'compareTo', { ...method, value: (other: EnumMemberType<U>) => ordinal - other.ordinal() });
      Object.defineProperty(enumMember, 'equals', { ...method, value: (other: EnumMemberType<U>) => enumMember.value() === other.value() });
      Object.defineProperty(obj, value, { ...enumerable, value: enumMember });
    }
    return obj;
  };
}
