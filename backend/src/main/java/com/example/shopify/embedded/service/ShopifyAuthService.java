package com.example.shopify.embedded.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class ShopifyAuthService {

    @Value("${shopify.client-id}")
    private String clientId;

    @Value("${shopify.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean verifyHmac(String hmac, Map<String, String> params) {
        TreeMap<String, String> sortedParams = new TreeMap<>(params);
        
        String message = sortedParams.entrySet().stream()
            .map(entry -> entry.getKey() + "=" + entry.getValue())
            .collect(Collectors.joining("&"));

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(clientSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] bytes = mac.doFinal(message.getBytes(StandardCharsets.UTF_8));
            String calculatedHmac = Base64.getEncoder().encodeToString(bytes);

            return hmac.equals(calculatedHmac);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to verify HMAC", e);
        }
    }

    public String exchangeCodeForToken(String code, String shop) {
        String url = "https://" + shop + "/admin/oauth/access_token";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = Map.of(
            "client_id", clientId,
            "client_secret", clientSecret,
            "code", code
        );

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        
        Map<String, String> response = restTemplate.postForObject(url, request, Map.class);
        
        return response.get("access_token");
    }
}