package com.nom.restaurant_service.controller;

import com.nom.restaurant_service.model.Offer;
import com.nom.restaurant_service.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/special-offers")
public class OfferController {

    @Autowired
    private OfferRepository offerRepository;

    @GetMapping
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    @GetMapping("/category/{category}")
    public List<Offer> getByCategory(@PathVariable String category) {
        return offerRepository.findByCategory(category);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<Offer> getByRestaurant(@PathVariable Long restaurantId) {
        return offerRepository.findByRestaurantId(restaurantId);
    }
}
