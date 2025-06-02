package com.boot.test.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Tests {
	
	//CrossOrigin -> com.boot.z_config\ WebConfig 아래 추가했습니다
	
	@GetMapping("/test")
    public String hello() {
        return "백엔드에서 보낸 문자입니다.";
    }
	
}
