package com.boot.collection.dto;

import java.util.List;

import lombok.Data;

@Data
public class ItemIdsInOrderRequest {
	private List<String> items; 
}
