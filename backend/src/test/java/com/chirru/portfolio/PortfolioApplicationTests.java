package com.chirru.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PortfolioApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testProfileEndpoint() throws Exception {
        mockMvc.perform(get("/portfolio/profile").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", notNullValue()))
                .andExpect(jsonPath("$.imageUrl", notNullValue()));
    }

    @Test
    void testSkillsEndpoint() throws Exception {
        mockMvc.perform(get("/portfolio/skills").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$[0].name", notNullValue()));
    }

    @Test
    void testSeoEndpoint() throws Exception {
        mockMvc.perform(get("/portfolio/seo?page=home").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", notNullValue()));
    }

    @Test
    void testResumeEndpoint() throws Exception {
        mockMvc.perform(get("/portfolio/resume"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PDF));
    }

    @Test
    void testContactEndpoint() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/portfolio/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Tester\",\"email\":\"test@example.com\",\"subject\":\"Hello\",\"message\":\"Testing contact form\"}"))
                .andExpect(status().isOk());
    }
}
