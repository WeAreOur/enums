const method = { writable: false, enumerable: false };
const enumerable = { writable: false, enumerable: true };
export function Enum(getValue) {
    return (values) => {
        const obj = {};
        Object.defineProperty(obj, 'values', { ...method, value: () => values });
        Object.defineProperty(obj, 'sort', { ...method, value: (values) => values.sort((a, z) => a.compareTo(z)) });
        for (const [ordinal, value] of values.entries()) {
            const enumMemberValue = getValue(value, ordinal);
            const enumMember = {};
            Object.defineProperty(enumMember, 'value', { ...method, value: () => enumMemberValue });
            Object.defineProperty(enumMember, 'valueOf', { ...method, value: () => enumMemberValue });
            Object.defineProperty(enumMember, 'toString', { ...method, value: () => enumMemberValue.toString() });
            Object.defineProperty(enumMember, 'name', { ...method, value: () => value });
            Object.defineProperty(enumMember, 'ordinal', { ...method, value: () => ordinal });
            Object.defineProperty(enumMember, 'compareTo', { ...method, value: (other) => ordinal - other.ordinal() });
            Object.defineProperty(enumMember, 'equals', { ...method, value: (other) => enumMember.value() === other.value() });
            Object.defineProperty(obj, value, { ...enumerable, value: enumMember });
        }
        return obj;
    };
}
// Easy TS enum replacement
export const TsEnum = Enum(Symbol);
