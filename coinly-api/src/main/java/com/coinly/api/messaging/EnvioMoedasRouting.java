package com.coinly.api.messaging;

public final class EnvioMoedasRouting {

    public static final String COMMANDS_EXCHANGE = "coinly.commands";
    public static final String EVENTS_EXCHANGE = "coinly.events";

    public static final String COMMANDS_DLX = "coinly.commands.dlx";

    public static final String COMMAND_QUEUE = "envio-moedas.commands";
    public static final String COMMAND_DLQ = "envio-moedas.commands.dlq";
    public static final String COMMAND_ROUTING_KEY = "envio-moedas";

    public static final String EVENT_ROUTING_PREFIX = "envio-moedas.";
    public static final String EVENT_SUCESSO_KEY = EVENT_ROUTING_PREFIX + "sucesso";
    public static final String EVENT_FALHOU_KEY = EVENT_ROUTING_PREFIX + "falhou";

    public static final String EVENT_EMAIL_QUEUE = "envio-moedas.events.email";

    private EnvioMoedasRouting() {
    }
}
