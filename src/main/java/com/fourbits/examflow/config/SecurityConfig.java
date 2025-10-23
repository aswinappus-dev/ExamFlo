package com.fourbits.examflow.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // This replaces your hard-coded "password" check from AppContext.tsx
    @Bean
    public UserDetailsService userDetailsService() {
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(User.withUsername("admin")
                .password(passwordEncoder().encode("password"))
                .roles("ADMIN")
                .build());
        return manager;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    AuthenticationManagerBuilder authenticationManagerBuilder =
            http.getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder
            .userDetailsService(userDetailsService()) // Use the bean defined above
            .passwordEncoder(passwordEncoder());    // Use the bean defined above
    return authenticationManagerBuilder.build(); // Use build() directly
}


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
            .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity (we can enable later)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Use stateless sessions (JWT)
            
            .authorizeHttpRequests(authz -> authz
                // PUBLIC ROUTES: Allow everyone to access these
                .requestMatchers(
                        "/", 
                        "/index.html",
                        "/student.html",
                        "/invigilator.html",
                        "/about.html",
                        "/support.html",
                        "/admin-login.html",
                        "/css/**", 
                        "/js/**", 
                        "/assets/**", // Any images/logos
                        "/api/auth/**", // Login/Logout
                        "/api/public/**"  // Public data for students/invigilators
                ).permitAll()
                
                // ADMIN ROUTES: Only allow users with "ADMIN" role
                .requestMatchers(
                        "/admin/**",       // All HTML pages in /admin/
                        "/api/admin/**",   // All admin data APIs
                        "/api/invigilator/**" // Invigilator actions should also be protected
                ).hasRole("ADMIN") 
                
                // All other requests must be authenticated
                .anyRequest().authenticated()
            )
            
            .formLogin(form -> form
                // This is a placeholder, as we are doing a custom JSON login
                .loginPage("/admin-login.html")
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout") // Define logout URL
                .logoutSuccessHandler((req, res, auth) -> res.setStatus(200)) // Send "OK" on logout
            );
            
            

        return http.build();
    }

    // This allows your frontend (even if on a different port) to call the backend
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:8080")); // Allow your dev server
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}