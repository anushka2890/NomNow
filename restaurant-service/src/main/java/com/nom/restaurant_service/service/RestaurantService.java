package com.nom.restaurant_service.service;

import com.nom.restaurant_service.model.MenuItem;
import com.nom.restaurant_service.model.Restaurant;
import com.nom.restaurant_service.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public Restaurant createRestaurant(Restaurant restaurant) {
        // Set back-reference on each menu item
        if (restaurant.getMenuItems() != null) {
            for (MenuItem item : restaurant.getMenuItems()) {
                item.setRestaurant(restaurant);
            }
        }
        return restaurantRepository.save(restaurant);
    }


    public Restaurant findRestaurantById(Long id) {
        return restaurantRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Restaurant not found with id " + id)
        );
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    public Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant) {
        return restaurantRepository.findById(id).map(existingRestaurant -> {
            existingRestaurant.setName(updatedRestaurant.getName());
            existingRestaurant.setAddress(updatedRestaurant.getAddress());
            for (MenuItem item : updatedRestaurant.getMenuItems()) {
                item.setRestaurant(existingRestaurant); // maintain bidirectional link
                existingRestaurant.getMenuItems().add(item);
            }
            existingRestaurant.setRating(updatedRestaurant.getRating());
            return restaurantRepository.save(existingRestaurant);
        }).orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

}
