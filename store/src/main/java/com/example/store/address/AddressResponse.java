package com.example.store.address;

public class AddressResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String street;
    private String city;
    private String zipCode;
    private String country;

    public AddressResponse(Address a) {
        this.id = a.getId();
        this.fullName = a.getFullName();
        this.phone = a.getPhone();
        this.street = a.getStreet();
        this.city = a.getCity();
        this.zipCode = a.getZipCode();
        this.country = a.getCountry();
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getPhone() { return phone; }
    public String getStreet() { return street; }
    public String getCity() { return city; }
    public String getZipCode() { return zipCode; }
    public String getCountry() { return country; }
}