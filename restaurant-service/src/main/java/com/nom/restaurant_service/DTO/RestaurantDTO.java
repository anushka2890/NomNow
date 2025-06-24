package com.nom.restaurant_service.DTO;

public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private Double rating;
    private String imageUrl;

    public RestaurantDTO() {}  // REQUIRED: No-arg constructor

    public RestaurantDTO(Long id, String name, String address, Double rating, String imageUrl) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // ✅ GETTERS (required for serialization)
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public Double getRating() {
        return rating;
    }

    // (Optional but good) - setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}
