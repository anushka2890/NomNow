package com.nom.auth_service.dto;

public class AuthRequest {
    private String email;
    private String password;
    public AuthRequest() {}
    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public void setEmail(String email) {this.email = email;}
    public void setPassword(String password) {this.password = password;}

}
