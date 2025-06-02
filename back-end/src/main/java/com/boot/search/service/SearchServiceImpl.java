package com.boot.search.service;

public class SearchServiceImpl implements SearchService {
	private KeyboardMapper keyboardMapper;
	private TypoCheck typoCheck;

	@Override
	public String resultText(String text) {

		String Kor_text = keyboardMapper.convertEngToKor(text);
		String result_text = typoCheck.combine(Kor_text);

		return result_text;
	}

}
