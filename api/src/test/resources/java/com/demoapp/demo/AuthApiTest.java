package com.demoapp.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void deveRetornarErroAoCadastrarEmailJaExistente() throws Exception {
        String jsonUser = "{\"email\":\"duplicado@fag.edu.br\", \"password\":\"SenhaForte123!\"}";

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonUser));

        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonUser))
                .andExpect(status().is4xxClientError()); 
    }

    @Test
    public void deveRetornarErroAoRecuperarSenhaDeEmailFantasma() throws Exception {
        String jsonReset = "{\"email\":\"fantasma@fag.edu.br\"}";

        mockMvc.perform(post("/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonReset))
                .andExpect(status().is4xxClientError()); 
    }

    @Test
    public void CAPTURA_BUG_naoDeveValidarForcaDaSenhaNoLogin() throws Exception {
        String jsonLogin = "{\"email\":\"teste@fag.edu.br\", \"password\":\"123\"}";

        mockMvc.perform(post("/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonLogin))
                .andExpect(status().isUnauthorized()); 
    }
}