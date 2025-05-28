package com.nom.restaurant_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "menu_item")
@Data
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Boolean available;
    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}
