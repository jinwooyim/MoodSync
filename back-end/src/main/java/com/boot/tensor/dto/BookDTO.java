package com.boot.tensor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDTO {
	private int bookNumber;
	private int emotionNumber;
	private String actingName;
}
