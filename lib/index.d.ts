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
};
type JavaEnumClass<T extends readonly string[]> = {
    values: () => T;
};
type EnumMemberType<U> = U & JavaEnumMember<U>;
type EnumType<T extends readonly string[], U> = {
    [K in T[number]]: EnumMemberType<U>;
} & JavaEnumClass<T> & {
    sort: (values: EnumMemberType<U>[]) => EnumMemberType<U>[];
};
export declare function Enum<U extends JavaSerializable>(getValue: (key: string) => U): <T extends readonly string[]>(values: T) => EnumType<T, U>;
export {};
