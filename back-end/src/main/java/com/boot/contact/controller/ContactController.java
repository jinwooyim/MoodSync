package com.boot.contact.controller;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.contact.service.ContactService;
import com.boot.user.dto.BasicUserDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class ContactController {

	@Autowired
	private ContactService contactService;

	@GetMapping("/contacts")
	public ResponseEntity<?> insertContact(@RequestParam HashMap<String, String> param, HttpServletRequest request) {

		BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

		int userNumber = userDTO.getUserNumber();
		String contact_title = param.get("contact_title");
		String contact_content = param.get("contact_content");

		contactService.insertContact(userNumber, contact_title, contact_content);
		return null;
	}

}
