package com.nom.restaurant_service.DTO;

public class RestaurantAndMenuDTO {
    private Long id;
    private String name;
    private String address;
    private Double rating;
    private String imageUrl;
    private String menuMatch;

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

    public String getMenuMatch() {
        return menuMatch;
    }

    public void setMenuMatch(String menuMatch) {
        this.menuMatch = menuMatch;
    }
}
