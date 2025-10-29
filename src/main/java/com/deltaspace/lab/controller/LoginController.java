package com.deltaspace.lab.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/login")
public class LoginController {

    @PostMapping
    public ResponseEntity<Void> setCookie(
        @RequestBody String username,
        HttpServletResponse response
    ) {
        response.addCookie(new Cookie("uname", username));
        return ResponseEntity.ok().build();
    }

}
