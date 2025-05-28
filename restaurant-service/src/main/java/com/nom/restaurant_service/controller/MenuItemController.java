package com.nom.restaurant_service.controller;

import com.nom.restaurant_service.model.MenuItem;
import com.nom.restaurant_service.service.MenuItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restaurants/{restaurantId}/menu-items")
@Tag(name = "Menu Item Controller", description = "APIs for managing menu items of restaurants")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @PostMapping
    @Operation(summary = "add a menu item")
    public ResponseEntity<MenuItem> addMenuItem(
            @PathVariable Long restaurantId,
            @RequestBody MenuItem menuItem) {
        return new ResponseEntity<>(menuItemService.addMenuItem(restaurantId, menuItem), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "get menu items")
    public ResponseEntity<List<MenuItem>> getMenuItems(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(menuItemService.getMenuItemsByRestaurant(restaurantId));
    }

    @DeleteMapping("/{menuItemId}")
    @Operation(summary = "delete menu item")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long menuItemId) {
        menuItemService.deleteMenuItem(menuItemId);
        return ResponseEntity.noContent().build();
    }
}
