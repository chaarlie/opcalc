package com.opcalc.common.adapter.out.auth.service;

import com.opcalc.common.adapter.out.persistence.UserAccountEntity;
import com.opcalc.common.adapter.out.persistence.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    public static final String ROLE_USER = "ROLE_USER";

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final UserAccountEntity userAccount = userAccountRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("User " + username + " not found"));
        final List<SimpleGrantedAuthority> roles = Collections.singletonList(
                new SimpleGrantedAuthority(CustomUserDetailsService.ROLE_USER));
        return new JwtUserDetails(userAccount.getId(), username, userAccount.getPassword(), roles);
    }

}
