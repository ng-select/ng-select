export function isDefined(value: any) {
    return value !== undefined && value !== null;
}

export function escapeRegExp(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}