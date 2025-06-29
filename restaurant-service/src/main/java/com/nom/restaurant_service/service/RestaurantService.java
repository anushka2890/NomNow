package com.nom.restaurant_service.service;

import com.nom.restaurant_service.DTO.RestaurantAndMenuDTO;
import com.nom.restaurant_service.DTO.RestaurantDTO;
import com.nom.restaurant_service.model.MenuItem;
import com.nom.restaurant_service.model.Restaurant;
import com.nom.restaurant_service.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
            existingRestaurant.setRating(updatedRestaurant.getRating());
            existingRestaurant.setImageUrl(updatedRestaurant.getImageUrl());
            if (updatedRestaurant.getMenuItems() != null && !updatedRestaurant.getMenuItems().isEmpty()) {
                for (MenuItem item : updatedRestaurant.getMenuItems()) {
                    item.setRestaurant(existingRestaurant); // maintain bidirectional link
                    existingRestaurant.getMenuItems().add(item);
                }
            }
            return restaurantRepository.save(existingRestaurant);
        }).orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

    public List<RestaurantAndMenuDTO> searchByNameOrMenuItem(String query) {
        List<Restaurant> allRestaurants = restaurantRepository.findAll();
        String lowerQuery = query.toLowerCase();

        return allRestaurants.stream()
                .map(restaurant -> {
                    boolean nameMatches = restaurant.getName().toLowerCase().contains(lowerQuery);

                    String matchedMenuItem = restaurant.getMenuItems().stream()
                            .filter(item -> item.getName().toLowerCase().contains(lowerQuery))
                            .map(MenuItem::getName)
                            .findFirst()
                            .orElse(null);

                    if (nameMatches || matchedMenuItem != null) {
                        return convertToDTO(restaurant, matchedMenuItem);
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }


    private RestaurantAndMenuDTO convertToDTO(Restaurant restaurant, String matchedMenuItem) {
        RestaurantAndMenuDTO dto = new RestaurantAndMenuDTO();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setAddress(restaurant.getAddress());
        dto.setRating(restaurant.getRating());
        dto.setImageUrl(restaurant.getImageUrl());
        dto.setMenuMatch(matchedMenuItem); // can be null
        return dto;
    }

}
