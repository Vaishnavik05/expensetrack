package com.expensetracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthFilter(JwtUtil jwtUtil, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        logger.info("Processing request path: " + path);

        // Skip public endpoints
        if (path.startsWith("/api/auth/")) {
            logger.info("Public endpoint - skipping JWT validation");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authHeader = request.getHeader("Authorization");
            logger.info("Authorization header: " + (authHeader != null ? "Present" : "Missing"));

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.warn("No valid Bearer token found");
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring(7);
            logger.info("Extracted token: " + token.substring(0, Math.min(20, token.length())) + "...");

            String username = jwtUtil.extractUsername(token);
            logger.info("Extracted username from token: " + username);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                logger.info("Loaded user details for: " + username);

                if (jwtUtil.isTokenValid(token, username)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("✓ Authentication successful for: " + username);
                } else {
                    logger.warn("Token validation failed for username: " + username);
                }
            }
        } catch (Exception e) {
            logger.error("JWT Authentication failed: " + e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}
