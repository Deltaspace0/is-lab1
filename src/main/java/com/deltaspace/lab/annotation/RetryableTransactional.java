package com.deltaspace.lab.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@Retryable(
    maxAttempts = 10,
    backoff = @Backoff(delay = 100),
    retryFor = TransactionSystemException.class
)
@Transactional(isolation = Isolation.SERIALIZABLE)
public @interface RetryableTransactional {
}
