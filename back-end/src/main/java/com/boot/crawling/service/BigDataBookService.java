package com.boot.crawling.service;

import com.boot.crawling.dto.BigDataBookDTO;

public interface BigDataBookService {
	public BigDataBookDTO searchBooks(String srchTarget, String query, int pageSize, int pageNum, String sort,
			String category);
}
