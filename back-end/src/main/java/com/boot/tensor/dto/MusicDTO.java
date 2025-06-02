package com.boot.tensor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MusicDTO {
	private int musicNumber;
	private int emotionNumber;
	private String actingName;
}
