package com.trackit.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @JsonProperty // allow deserialization (input)
    public void setPassword(String password) {
        this.password = password;
    }
}
