package com.opcalc.common.application.domain.factory;

import org.springframework.web.reactive.function.client.WebClient;

public class RandomStringOperation implements GenericOperation {
    @Override
    public String execute() {
        WebClient client = WebClient.create();
        String response = client.get()
                .uri("https://www.random.org/strings/?num=1&len=8&digits=off&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (response != null) {
            response = response.trim();
        }

        return response;
    }
}
