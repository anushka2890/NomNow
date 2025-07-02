package com.nom.restaurant_service.service;

import com.nom.restaurant_service.DTO.MenuItemDTO;
import com.nom.restaurant_service.DTO.OfferDTO;
import com.nom.restaurant_service.DTO.RestaurantAndMenuDTO;
import com.nom.restaurant_service.DTO.RestaurantDTO;
import com.nom.restaurant_service.model.MenuItem;
import com.nom.restaurant_service.model.Offer;
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

    public RestaurantDTO createRestaurant(Restaurant restaurant) {
        // Set back-reference on each menu item
        if (restaurant.getMenuItems() != null) {
            for (MenuItem item : restaurant.getMenuItems()) {
                item.setRestaurant(restaurant);
            }
        }
        return toRestaurantDTO(restaurantRepository.save(restaurant));
    }


    public RestaurantDTO findRestaurantById(Long id) {
        return toRestaurantDTO(restaurantRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Restaurant not found with id " + id)
        ));
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }

    public RestaurantDTO updateRestaurant(Long id, Restaurant updatedRestaurant) {
        return toRestaurantDTO(restaurantRepository.findById(id).map(existingRestaurant -> {
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
        }).orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id)));
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

    public RestaurantDTO toRestaurantDTO(Restaurant restaurant) {
        List<MenuItemDTO> menuItemDTOs = restaurant.getMenuItems().stream()
                .map(menuItem -> new MenuItemDTO(
                        menuItem.getId(),
                        menuItem.getName(),
                        menuItem.getDescription(),
                        menuItem.getPrice(),
                        menuItem.getAvailableQuantity(),
                        menuItem.getImageUrl(),
                        menuItem.getCategory(),
                        toOfferDTO(menuItem.getOffer())
                ))
                .collect(Collectors.toList());

        return new RestaurantDTO(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getAddress(),
                restaurant.getRating(),
                restaurant.getImageUrl(),
                menuItemDTOs
        );
    }

    public OfferDTO toOfferDTO(Offer offer) {
        if (offer == null) return null;

        OfferDTO dto = new OfferDTO();
        dto.setId(offer.getId());
        dto.setTitle(offer.getTitle());
        dto.setDescription(offer.getDescription());
        dto.setImageUrl(offer.getImageUrl());
        dto.setCategory(offer.getCategory());
        dto.setRestaurantId(offer.getRestaurantId());
        dto.setDiscountAmount(offer.getDiscountAmount());
        dto.setOfferType(offer.getOfferType());

        // ✅ Safely set menuItemId only if offer is linked to a menu item
        if (offer.getMenuItem() != null) {
            dto.setMenuItemId(offer.getMenuItem().getId());
        }

        return dto;
    }

}
