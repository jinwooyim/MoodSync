package com.boot.analize.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeSeriesDTO {
	private String hourTime; // '2025061315' 형식 (yyyyMMddHH)
	private int count;
}
