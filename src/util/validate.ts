export interface Validable {
    value: string | number;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    min?: number;
    max?: number;
}
// validation function
export function validate(input: Validable) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }
    if (input.maxLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length <= input.maxLength;
    }
    if (input.minLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length >= input.minLength;
    }
    if (input.min != null && typeof input.value === 'number') {
        isValid = isValid && input.value >= input.min;
    }
    if (input.max != null && typeof input.value === 'number') {
        isValid = isValid && input.value <= input.max;
    }
    return isValid;
}