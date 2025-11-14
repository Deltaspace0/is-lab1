package com.deltaspace.lab.exception;

import java.util.List;
import java.util.Map;

public class FieldValidationException extends RuntimeException {

    private final String field;
    private final String message;
    private final String personName;

    public FieldValidationException(
        String field,
        String message,
        String personName
    ) {
        super(message);
        this.field = field;
        this.message = message;
        this.personName = personName;
    }

    public FieldValidationException(String field, String message) {
        this(field, message, null);
    }

    public Object getFieldErrors() {
        Map<String, String> error = Map.of(
            "field", field,
            "defaultMessage", message,
            "personName", personName
        );
        return Map.of("errors", List.of(error));
    }

}
