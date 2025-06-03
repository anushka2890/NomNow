package com.nom.order_service.config;

import com.nom.order_service.DTO.OrderStatusFromRestaurantDTO;
import com.nom.order_service.DTO.PaymentStatusDTO;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.aspectj.weaver.ast.Or;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class KafkaConsumerConfig {

//    @Bean
//    public ConsumerFactory<String, PaymentStatusDTO> paymentStatusConsumerFactory() {
//        Map<String, Object> config = new HashMap<>();
//        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
//        config.put(ConsumerConfig.GROUP_ID_CONFIG, "nomnow-group");
//        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
//        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
//        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
//
//        return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(), new JsonDeserializer<>(PaymentStatusDTO.class));
//    }
//
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String, PaymentStatusDTO> kafkaListenerContainerFactory() {
//        ConcurrentKafkaListenerContainerFactory<String, PaymentStatusDTO> factory = new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(paymentStatusConsumerFactory());
//        return factory;
//    }
//
//    @Bean
//    public ConsumerFactory<String, OrderStatusFromRestaurantDTO> orderConfirmedConsumerFactory() {
//        JsonDeserializer<OrderStatusFromRestaurantDTO> deserializer = new JsonDeserializer<>(OrderStatusFromRestaurantDTO.class);
//        deserializer.setRemoveTypeHeaders(false);  // optionally set to true
//        deserializer.addTrustedPackages("*");      // or restrict to your package
//
//        return new DefaultKafkaConsumerFactory<>(
//                Map.of(
//                        ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092",
//                        ConsumerConfig.GROUP_ID_CONFIG, "order-group",
//                        ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class,
//                        ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, deserializer
//                ),
//                new StringDeserializer(),
//                deserializer
//        );
//    }
//
//    @Bean
//    public ConcurrentKafkaListenerContainerFactory<String, OrderStatusFromRestaurantDTO> kafkaListenerContainerFactoryForOrderStatus() {
//        ConcurrentKafkaListenerContainerFactory<String, OrderStatusFromRestaurantDTO> factory = new ConcurrentKafkaListenerContainerFactory<>();
//        factory.setConsumerFactory(orderConfirmedConsumerFactory());
//        return factory;
//    }

}