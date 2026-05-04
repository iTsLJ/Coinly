package com.coinly.api.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CnpjValidator implements ConstraintValidator<Cnpj, String> {

    private static final int[] WEIGHTS_FIRST = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
    private static final int[] WEIGHTS_SECOND = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        String digits = value.replaceAll("\\D", "");
        if (digits.length() != 14) {
            return false;
        }
        if (digits.chars().distinct().count() == 1) {
            return false;
        }
        return checkDigit(digits, WEIGHTS_FIRST, 12) && checkDigit(digits, WEIGHTS_SECOND, 13);
    }

    private boolean checkDigit(String digits, int[] weights, int position) {
        int sum = 0;
        for (int i = 0; i < weights.length; i++) {
            sum += Character.getNumericValue(digits.charAt(i)) * weights[i];
        }
        int remainder = sum % 11;
        int expected = remainder < 2 ? 0 : 11 - remainder;
        return Character.getNumericValue(digits.charAt(position)) == expected;
    }
}
