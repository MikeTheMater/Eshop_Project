package com.example.store.address;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.store.user.User;
import com.example.store.user.UserRepository;

@Service
public class AddressService {

    private final AddressRepository addressRepo;
    private final UserRepository userRepo;

    public AddressService(AddressRepository addressRepo, UserRepository userRepo) {
        this.addressRepo = addressRepo;
        this.userRepo = userRepo;
    }

    // Gets the currently authenticated user from Spring Security
    private User currentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<AddressResponse> getMyAddresses() {
        return addressRepo.findByUser(currentUser())
                .stream()
                .map(AddressResponse::new)
                .toList();
    }

    public AddressResponse save(AddressRequest req) {
        Address address = new Address();
        address.setUser(currentUser());
        address.setFullName(req.getFullName());
        address.setPhone(req.getPhone());
        address.setStreet(req.getStreet());
        address.setCity(req.getCity());
        address.setZipCode(req.getZipCode());
        address.setCountry(req.getCountry());
        return new AddressResponse(addressRepo.save(address));
    }

    public void delete(Long id) {
        Address address = addressRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        // Make sure users can only delete their own addresses
        if (!address.getUser().getId().equals(currentUser().getId())) {
            throw new RuntimeException("Not authorized");
        }
        addressRepo.deleteById(id);
    }
}