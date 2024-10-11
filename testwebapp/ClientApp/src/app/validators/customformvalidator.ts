import { AbstractControl, ValidatorFn } from '@angular/forms';

export function nonNegativeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    return value < 0 ? { nonNegative: { value } } : null;
  };
}