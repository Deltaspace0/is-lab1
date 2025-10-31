package com.deltaspace.lab.exception;

import java.util.List;
import java.util.Map;

public class FieldValidationException extends RuntimeException {

    private final String field;
    private final String message;

    public FieldValidationException(String field, String message) {
        super(message);
        this.field = field;
        this.message = message;
    }

    public Object getFieldErrors() {
        Map<String, String> error = Map.of(
            "field", field,
            "defaultMessage", message
        );
        return Map.of("errors", List.of(error));
    }

}
