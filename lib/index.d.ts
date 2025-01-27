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
};
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
export declare function Enum<U extends JavaSerializable>(getValue: (key: string, index: number) => U): <T extends readonly string[]>(values: T) => EnumType<T, U>;
export declare const TsEnum: <T extends readonly string[]>(values: T) => EnumType<T, symbol>;
export type EnumNames<T> = T extends EnumType<infer K, infer V> ? K[number] : never;
export type EnumMembers<T> = T extends EnumType<infer K, infer V> ? T[K[number]] : never;
export {};
