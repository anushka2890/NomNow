package com.nom.restaurant_service.DTO;

import java.util.List;

public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private Double rating;
    private String imageUrl;
    private List<MenuItemDTO> menuItemDTOList;

    public RestaurantDTO() {}  // REQUIRED: No-arg constructor

    public RestaurantDTO(Long id, String name, String address, Double rating, String imageUrl, List<MenuItemDTO> menuItemDTOList) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.menuItemDTOList = menuItemDTOList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<MenuItemDTO> getMenuItemDTOList() {
        return menuItemDTOList;
    }

    public void setMenuItemDTOList(List<MenuItemDTO> menuItemDTOList) {
        this.menuItemDTOList = menuItemDTOList;
    }
}
