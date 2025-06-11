package com.boot.search.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/search")
public class SearchController {

	@GetMapping("/activities")
	public void activities() {

	}

	@GetMapping("/music")
	public void music() {

	}

	@GetMapping("/music")
	public void books() {

	}
}