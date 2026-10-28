package com.example.backend.security;

import com.example.backend.service.UserService.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.access.AccessDeniedHandlerImpl;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig {

    @Autowired
    CustomUserDetailsService userDetailsService;
    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;
    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable())
                .exceptionHandling(exceptionHandling ->
                        exceptionHandling
                                .authenticationEntryPoint(unauthorizedHandler)
                                .accessDeniedHandler(new AccessDeniedHandlerImpl())
                )
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers(HttpMethod.POST, "/auth/signin", "/auth/signup").permitAll()
                                .requestMatchers(HttpMethod.GET, "/auth/me").authenticated()
                                .requestMatchers(HttpMethod.GET, "/api/test/all").permitAll()
                                .requestMatchers(HttpMethod.GET, "/books/**", "/authors/**", "/reviews/**").permitAll()
                                .requestMatchers("/users/**").hasRole("ADMIN")
                                .requestMatchers("/books/**", "/authors/**", "/reservation_items/**").hasRole("ADMIN")
                                .requestMatchers(HttpMethod.PUT, "/reservations/*/status").hasRole("ADMIN")
                                .requestMatchers("/reviews/**").hasAnyRole("USER", "ADMIN")
                                .requestMatchers("/reservations/**").hasAnyRole("USER", "ADMIN")
                                .anyRequest().denyAll()
                );

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
