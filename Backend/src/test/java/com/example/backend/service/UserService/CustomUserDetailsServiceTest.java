package com.example.backend.service.UserService;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CustomUserDetailsServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final CustomUserDetailsService userDetailsService = new CustomUserDetailsService(userRepository);

    @Test
    void loadsPersistedRolesAsGrantedAuthorities() {
        User user = new User();
        user.setEmail("admin@example.com");
        user.setPasswordHash("encoded-password");
        user.setRoles(new HashSet<>(Set.of("ROLE_USER", "ROLE_ADMIN")));
        when(userRepository.findByEmail(user.getEmail())).thenReturn(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        assertEquals(Set.of("ROLE_USER", "ROLE_ADMIN"), userDetails.getAuthorities().stream()
                .map(authority -> authority.getAuthority())
                .collect(java.util.stream.Collectors.toSet()));
    }

    @Test
    void rejectsUnknownEmail() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("missing@example.com"));
    }
}
