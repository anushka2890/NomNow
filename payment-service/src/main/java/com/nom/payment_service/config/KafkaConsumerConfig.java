package com.nom.payment_service.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConsumerConfig {

//    @Bean
//    public ConsumerFactory<String, OrderConfirmedDTO> orderConfirmedConsumerFactory(){
//        JsonDeserializer<OrderConfirmedDTO> deserializer = new JsonDeserializer<>(OrderConfirmedDTO.class);
//        deserializer.addTrustedPackages("*");
//        deserializer.setUseTypeMapperForKey(true);
//
//        Map<String, Object> props = new HashMap<>();
//        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//        props.put(ConsumerConfig.GROUP_ID_CONFIG, "payment-group");
//        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
//
//        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
//    }
//
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String, OrderConfirmedDTO> orderConfirmedKafkaListenerFactory() {
//        ConcurrentKafkaListenerContainerFactory<String, OrderConfirmedDTO> factory = new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(orderConfirmedConsumerFactory());
//        return factory;
//    }
}
