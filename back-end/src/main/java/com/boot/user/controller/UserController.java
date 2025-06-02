package com.boot.user.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.boot.user.dto.BasicUserDTO;
import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;
import com.boot.z_config.security.UserUtils;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class UserController {

	@Autowired
	private UserService service;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@RequestMapping("/joinProc")
	public ResponseEntity<String> join(HttpServletRequest request, @RequestParam HashMap<String, String> param) {

		System.out.println("@#param => " + param);
		if (service.checkId(param) != null) {

		} else {
			int re = service.userJoin(param);
			if (re == 1) {
				return ResponseEntity.ok("available");
			}
		}
		return ResponseEntity.status(HttpStatus.CONFLICT).body("duplicate");
	}

	@RequestMapping("/user_info")
	public String getUserInfo(int u_number) {
		return "user/user_info";
	}

	@RequestMapping("/logout")
	public String logout(HttpServletRequest request) {
		return "redirect:loginForm";
	}

}