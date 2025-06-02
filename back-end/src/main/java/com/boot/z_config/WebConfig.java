package com.boot.z_config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private UserAttributeInterceptor userAttributeInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 모든 요청에 대해 사용자 정보를 모델에 추가하는 인터셉터 등록
        registry.addInterceptor(userAttributeInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                    "/resources/**", 
                    "/css/**", 
                    "/js/**", 
                    "/images/**", 
                    "/fonts/**", 
                    "/favicon.ico",
                    "/error/**"
                );
    }
}