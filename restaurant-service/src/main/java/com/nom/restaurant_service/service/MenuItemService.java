package com.nom.restaurant_service.service;

import com.nom.restaurant_service.DTO.MenuItemDTO;
import com.nom.restaurant_service.DTO.OfferDTO;
import com.nom.restaurant_service.model.MenuItem;
import com.nom.restaurant_service.model.Offer;
import com.nom.restaurant_service.model.Restaurant;
import com.nom.restaurant_service.repository.MenuItemRepository;
import com.nom.restaurant_service.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public MenuItem addMenuItem(Long restaurantId, MenuItem menuItem) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id " + restaurantId));
        menuItem.setRestaurant(restaurant);
        return menuItemRepository.save(menuItem);
    }

    public List<MenuItem> getMenuItemsByRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }

    public MenuItemDTO getMenuItemById(Long itemId) {
        MenuItem menuItem = menuItemRepository.findById(itemId).orElse(null);
        assert menuItem != null;
        return new MenuItemDTO(menuItem.getId(), menuItem.getName(), menuItem.getDescription(), menuItem.getPrice(), menuItem.getAvailableQuantity(), menuItem.getImageUrl(), menuItem.getCategory(), toOfferDTO(menuItem.getOffer()));
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
