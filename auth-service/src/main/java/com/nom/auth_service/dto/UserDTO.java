package com.nom.auth_service.dto;

import java.util.List;

public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private List<AddressDTO> addresses;

    public UserDTO(){}

    public UserDTO(Long id, String name, String email, String phone, List<AddressDTO> addresses) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.addresses = addresses;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public List<AddressDTO> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<AddressDTO> addresses) {
        this.addresses = addresses;
    }
}