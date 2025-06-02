package com.boot.test.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.boot.test.dto.Product;

import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
public class Tests {

	
	//CrossOrigin -> com.boot.z_config\ WebConfig 아래 추가했습니다
	
	@GetMapping("/test")
    public String hello() {
        return "백엔드에서 보낸 문자입니다.";
    }
	
	// 새로운 API 엔드포인트 추가: /test/products
    // Next.js 프론트엔드에서 호출할 URL과 일치
	//아래 gradle 설정 때문에, 보내는 데이터를 json 형식으로 지정
	// implementation 'com.fasterxml.jackson.dataformat:jackson-dataformat-xml' // 다중 xml 데이터 처리 
	@GetMapping(value = "/test/products", produces = MediaType.APPLICATION_JSON_VALUE) // json 형식
    public List<Product> getProducts() {
		
        List<Product> products = new ArrayList<>();
        products.add(new Product("p1", "노트북", 1200.00, "강력한 성능의 최신 노트북입니다."));
        products.add(new Product("p2", "스마트폰", 850.50, "혁신적인 기능을 갖춘 스마트폰입니다."));
        products.add(new Product("p3", "무선 이어폰", 150.00, "뛰어난 음질과 편리함을 제공합니다."));
        products.add(new Product("p4", "스마트 워치", 299.99, "건강 관리에 최적화된 스마트 워치입니다."));

        log.info("products=>"+products);
        // dto 사용하는 경우 : List<Product> 객체가 자동으로 JSON 배열로 직렬화되어 반환됩니다.
        return products; 
    }
	
	// POST 요청: 상품 데이터 받기
    @PostMapping(value = "/test/products", consumes = MediaType.APPLICATION_JSON_VALUE) // JSON 데이터를 받음
    public String addProduct(@RequestBody Product product) { // @RequestBody로 JSON 본문을 Product 객체로 매핑
        log.info("Received Product from Frontend: " + product.toString()); // 콘솔에 받은 Product 정보 출력

        // 실제 애플리케이션에서는 이 product 객체를 DB에 저장하거나 비즈니스 로직을 수행합니다.
        // 여기서는 단순히 콘솔에 출력하는 예시입니다.

        return "Product received successfully: " + product.getName();
    }
}
