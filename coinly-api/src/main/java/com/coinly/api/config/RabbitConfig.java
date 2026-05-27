package com.coinly.api.config;

import com.coinly.api.messaging.EnvioMoedasRouting;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Bean
    public DirectExchange commandsExchange() {
        return new DirectExchange(EnvioMoedasRouting.COMMANDS_EXCHANGE, true, false);
    }

    @Bean
    public DirectExchange commandsDeadLetterExchange() {
        return new DirectExchange(EnvioMoedasRouting.COMMANDS_DLX, true, false);
    }

    @Bean
    public TopicExchange eventsExchange() {
        return new TopicExchange(EnvioMoedasRouting.EVENTS_EXCHANGE, true, false);
    }

    @Bean
    public Queue envioMoedasCommandQueue() {
        return QueueBuilder.durable(EnvioMoedasRouting.COMMAND_QUEUE)
                .withArgument("x-dead-letter-exchange", EnvioMoedasRouting.COMMANDS_DLX)
                .withArgument("x-dead-letter-routing-key", EnvioMoedasRouting.COMMAND_ROUTING_KEY)
                .build();
    }

    @Bean
    public Queue envioMoedasCommandDlq() {
        return QueueBuilder.durable(EnvioMoedasRouting.COMMAND_DLQ).build();
    }

    @Bean
    public Queue envioMoedasEventEmailQueue() {
        return QueueBuilder.durable(EnvioMoedasRouting.EVENT_EMAIL_QUEUE).build();
    }

    @Bean
    public Binding envioMoedasCommandBinding(Queue envioMoedasCommandQueue, DirectExchange commandsExchange) {
        return BindingBuilder.bind(envioMoedasCommandQueue)
                .to(commandsExchange)
                .with(EnvioMoedasRouting.COMMAND_ROUTING_KEY);
    }

    @Bean
    public Binding envioMoedasCommandDlqBinding(Queue envioMoedasCommandDlq, DirectExchange commandsDeadLetterExchange) {
        return BindingBuilder.bind(envioMoedasCommandDlq)
                .to(commandsDeadLetterExchange)
                .with(EnvioMoedasRouting.COMMAND_ROUTING_KEY);
    }

    @Bean
    public Binding envioMoedasEventEmailBinding(Queue envioMoedasEventEmailQueue, TopicExchange eventsExchange) {
        return BindingBuilder.bind(envioMoedasEventEmailQueue)
                .to(eventsExchange)
                .with(EnvioMoedasRouting.EVENT_ROUTING_PREFIX + "*");
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter(mapper);
        DefaultClassMapper classMapper = new DefaultClassMapper();
        classMapper.setTrustedPackages("com.coinly.api.messaging");
        converter.setClassMapper(classMapper);
        return converter;
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
