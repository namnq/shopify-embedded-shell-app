package com.example.shopify.embedded.controller;

import com.example.shopify.embedded.security.JwtService;
import com.example.shopify.embedded.service.ShopifyAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final ShopifyAuthService shopifyAuthService;
    private final JwtService jwtService;

    @GetMapping("/callback")
    public ResponseEntity<Map<String, String>> handleCallback(
            @RequestParam String code,
            @RequestParam String shop,
            @RequestParam String hmac,
            @RequestParam String timestamp,
            @RequestParam(required = false) String state
    ) {
        // Verify HMAC
        if (!shopifyAuthService.verifyHmac(hmac, Map.of(
                "code", code,
                "shop", shop,
                "timestamp", timestamp,
                "state", state != null ? state : ""))) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid HMAC"));
        }

        // Exchange code for access token
        String accessToken = shopifyAuthService.exchangeCodeForToken(code, shop);

        // Generate JWT
        String jwt = jwtService.generateToken(shop);

        return ResponseEntity.ok(Map.of("token", jwt));
    }
}