package com.nom.restaurant_service.controller;

import com.nom.restaurant_service.DTO.MenuItemDTO;
import com.nom.restaurant_service.DTO.OfferDTO;
import com.nom.restaurant_service.model.MenuItem;
import com.nom.restaurant_service.model.Offer;
import com.nom.restaurant_service.service.MenuItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@Tag(name = "Menu Item Controller", description = "APIs for managing menu items")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    // ➤ Get all menu items for a specific restaurant
    @GetMapping("/restaurants/{restaurantId}/menu-items")
    @Operation(summary = "Get all menu items of a restaurant")
    public ResponseEntity<List<MenuItemDTO>> getMenuItems(@PathVariable Long restaurantId) {
        List<MenuItemDTO> dtos = menuItemService.getMenuItemsByRestaurant(restaurantId)
                .stream()
                .map(item -> new MenuItemDTO(
                        item.getId(),
                        item.getName(),
                        item.getDescription(),
                        item.getPrice(),
                        item.getAvailableQuantity(),
                        item.getImageUrl(),
                        item.getCategory(),
                        menuItemService.toOfferDTO(item.getOffer())
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // ➤ Add a menu item to a restaurant
    @PostMapping("/restaurants/{restaurantId}/menu-items")
    @Operation(summary = "Add a new menu item to a restaurant")
    public ResponseEntity<MenuItem> addMenuItem(
            @PathVariable Long restaurantId,
            @RequestBody MenuItem menuItem) {
        return new ResponseEntity<>(menuItemService.addMenuItem(restaurantId, menuItem), HttpStatus.CREATED);
    }

    // ➤ Delete a menu item by ID (global route)
    @DeleteMapping("/menu-items/{menuItemId}")
    @Operation(summary = "Delete a menu item by ID")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long menuItemId) {
        menuItemService.deleteMenuItem(menuItemId);
        return ResponseEntity.noContent().build();
    }

    // ➤ Get a specific menu item by ID (global route)
    @GetMapping("/menu-items/{itemId}")
    @Operation(summary = "Get a specific menu item by ID")
    public ResponseEntity<MenuItemDTO> getMenuItemById(@PathVariable Long itemId) {
        MenuItemDTO item = menuItemService.getMenuItemById(itemId);
        return ResponseEntity.ok(item);
    }
}
