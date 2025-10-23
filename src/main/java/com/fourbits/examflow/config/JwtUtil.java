package com.fourbits.examflow.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys; // Make sure this is imported if using roles claim

@Component
public class JwtUtil {

    @Value("${jwt.secret:DefaultSecretKeyWhichIsLongEnoughForHS256Algorithm}")
    private String secret;

    @Value("${jwt.expiration.ms:3600000}") // 1 hour default
    private long expirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = this.secret.getBytes(StandardCharsets.UTF_8);
        // Ensure key length meets algorithm requirements (HS256 needs >= 32 bytes)
        if (keyBytes.length < 32) {
             throw new IllegalArgumentException("JWT Secret key must be at least 32 bytes long for HS256");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                   .verifyWith(getSigningKey())
                   .build()
                   .parseSignedClaims(token)
                   .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (Exception e) {
             // Handle cases where expiration claim might be missing or token is malformed
             System.err.println("Could not check token expiration: " + e.getMessage());
             return true; // Treat errors as expired
        }
    }

    // =============================================================
    // == THIS IS THE METHOD THAT THE COMPILER CANNOT FIND ==
    // =============================================================
    /**
     * Generates a JWT token for the given UserDetails.
     * @param userDetails The user details obtained after authentication.
     * @return A String representing the JWT token.
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Example: Add roles to the token payload
        claims.put("roles", userDetails.getAuthorities().stream()
                                     .map(grantedAuthority -> grantedAuthority.getAuthority())
                                     .collect(Collectors.toList())); // Use Collectors.toList()
        return createToken(claims, userDetails.getUsername());
    }
    // =============================================================

    private String createToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                   .claims(claims)
                   .subject(subject)
                   .issuedAt(now)
                   .expiration(expiryDate)
                   .signWith(getSigningKey(), Jwts.SIG.HS256) // Specify Algorithm
                   .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
         try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
         } catch (Exception e) {
             System.err.println("Token validation failed: " + e.getMessage());
             return false;
         }
    }
}