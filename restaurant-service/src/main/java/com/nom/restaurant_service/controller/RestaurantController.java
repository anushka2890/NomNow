package com.nom.restaurant_service.controller;

import com.nom.restaurant_service.DTO.RestaurantAndMenuDTO;
import com.nom.restaurant_service.DTO.RestaurantDTO;
import com.nom.restaurant_service.model.Restaurant;
import com.nom.restaurant_service.service.RestaurantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rest")
@Tag(name = "Restaurant Controller", description = "APIs for managing restaurants")
public class RestaurantController {
    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    @Operation(summary = "create a restaurant entry")
    public ResponseEntity<RestaurantDTO> createRestaurant(@RequestBody Restaurant restaurant){
        RestaurantDTO newRestaurant = restaurantService.createRestaurant(restaurant);
        return new ResponseEntity<>(newRestaurant, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "find restaurant by id")
    public ResponseEntity<RestaurantDTO> findRestaurantById(@PathVariable Long id){
        RestaurantDTO restaurant = restaurantService.findRestaurantById(id);

        return ResponseEntity.ok(restaurant);
    }

    @GetMapping
    @Operation(summary = "get all restaurants")
    public ResponseEntity<List<RestaurantDTO>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants()
                .stream()
                .map(restaurantService::toRestaurantDTO)
                .collect(Collectors.toList()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "delete a restaurant")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Long id) {
        restaurantService.deleteRestaurant(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "update a restaurant")
    public RestaurantDTO updateRestaurant(@PathVariable Long id, @RequestBody Restaurant updatedRestaurant) {
        return restaurantService.updateRestaurant(id, updatedRestaurant);
    }

    @GetMapping("/search")
    public List<RestaurantAndMenuDTO> searchRestaurants(@RequestParam String query) {
        return restaurantService.searchByNameOrMenuItem(query);
    }
}
