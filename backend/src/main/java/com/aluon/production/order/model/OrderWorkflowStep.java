package com.aluon.production.order.model;

public enum OrderWorkflowStep {
    INBOX,
    REQUEST,
    BUDGET,
    VALIDATION,
    DEV,
    PROD,
    FINAL
}
