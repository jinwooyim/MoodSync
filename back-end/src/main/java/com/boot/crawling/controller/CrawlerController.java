package com.boot.crawling.controller;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.boot.crawling.service.YoutubeService;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class CrawlerController {
	
    @Autowired
    private YoutubeService youtubeService;

    @GetMapping("/youtube") // http://localhost:8485/youtube?keyword=기쁨
    public String youtubeSearch(@RequestParam(defaultValue = "기쁨") String keyword, Model model) {
        try {
            List<Map<String, String>> videoList = youtubeService.searchVideos(keyword);
            model.addAttribute("videos", videoList);
            model.addAttribute("keyword", keyword);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "youtube_result";
    }

    @GetMapping("/test-crawl") // http://localhost:8485/test-crawl?keyword=기쁨
    public String testCrawl(@RequestParam(defaultValue = "기쁨") String keyword, Model model) {
	    List<Map<String, String>> resultList = new ArrayList<>();
	
	    try {
	        String url = "https://www.bing.com/search?q=" + URLEncoder.encode(keyword, "UTF-8");
	        Document doc = Jsoup.connect(url)
	                            .userAgent("Mozilla/5.0")
	                            .get();
	
	        Elements items = doc.select("li.b_algo");
	        int count = 0;
	
	        for (Element item : items) {
	            if (count++ >= 5) break;
	
	            String title = item.selectFirst("h2 a") != null ? item.selectFirst("h2 a").text() : "제목 없음";
	            String link = item.selectFirst("h2 a") != null ? item.selectFirst("h2 a").attr("href") : "링크 없음";
	            String summary = item.selectFirst("p") != null ? item.selectFirst("p").text() : "요약 없음";
	
	            Map<String, String> result = new HashMap<>();
	            result.put("title", title);
	            result.put("summary", summary);
	            result.put("link", link);
	            
	            resultList.add(result);
	        }
	
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	
	    model.addAttribute("keyword", keyword);
	    model.addAttribute("resultList", resultList);
	    return "crawl_result";
    }
}
