package com.nom.restaurant_service.repository;

import com.nom.restaurant_service.model.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByCategory(String category);
    List<Offer> findByRestaurantId(Long restaurantId);
}
