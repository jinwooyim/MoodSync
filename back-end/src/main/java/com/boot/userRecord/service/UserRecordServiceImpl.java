package com.boot.userRecord.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.crawling.service.YoutubeService;
import com.boot.userRecord.dao.UserRecordDAO;
import com.boot.userRecord.dto.UserRecordDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("UserRecordService")
public class UserRecordServiceImpl implements UserRecordService {
	@Autowired
	private UserRecordDAO userRecordDAO;
	@Autowired
	private YoutubeService youtubeService;

//    @Override
//    public UserRecordDTO findById(Long id) {
//    	UserRecordDTO dto = userRecordDAO.findById(id);
//    	if(dto == null) return null;
//    	
//    	List<Long> actionIds = parseIds(dto.getAction_ids());
//        List<Long> bookIds = parseIds(dto.getBook_ids());
//        List<Long> musicIds = parseIds(dto.getMusic_ids());
//        
//    	dto.setRecommendedActions(userRecordDAO.findInfoByActingNumbers(actionIds));
//    	dto.setRecommendedBooks(userRecordDAO.findInfoByBookNumbers(bookIds));
//    	dto.setRecommendedMusics(userRecordDAO.findInfoByMusicNumbers(musicIds));
//    	
//    	String videoName = dto.getRecommendedMusics().get(0).getMusicName();
//    	List<Map<String, String>> video = null;
//    	try {
//			video = youtubeService.searchVideos(videoName);
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//			video = Collections.emptyList();
//		}
//    	
//        List<YoutubeVideoDTO> youtubeVideoDTOs = video.stream()
//                .map(result -> new YoutubeVideoDTO(
//                        result.get("title"),
//                        result.get("channel"),
//                        result.get("thumbnail"),
//                        result.get("videoUrl")
//                )).collect(Collectors.toList());
//        dto.setYoutubeSearchResults(youtubeVideoDTOs);
//    	
//    	log.info("UserRecordServiceImpl : "+dto);
//    	
//    	return dto;
//    }
<<<<<<< HEAD
	@Override
	public UserRecordDTO findById(Long id) {
		UserRecordDTO dto = userRecordDAO.findById(id);
		if (dto == null) {
			return null;
		}

		List<Long> actionIds = parseIds(dto.getAction_ids());
		List<Long> bookIds = parseIds(dto.getBook_ids());
		List<Long> musicIds = parseIds(dto.getMusic_ids());

		dto.setRecommendedActions(userRecordDAO.findInfoByActingNumbers(actionIds));
		dto.setRecommendedBooks(userRecordDAO.findInfoByBookNumbers(bookIds));
		dto.setRecommendedMusics(userRecordDAO.findInfoByMusicNumbers(musicIds));

=======
    @Override
    public UserRecordDTO findById(Long id) {
    	UserRecordDTO dto = userRecordDAO.findById(id);
    	if(dto == null) return null;
    	
    	List<Long> actionIds = parseIds(dto.getAction_ids());
    	List<Long> bookIds = parseIds(dto.getBook_ids());
    	List<Long> musicIds = parseIds(dto.getMusic_ids());
    	
    	dto.setRecommendedActions(userRecordDAO.findInfoByActingNumbers(actionIds));
    	dto.setRecommendedBooks(userRecordDAO.findInfoByBookNumbers(bookIds));
    	dto.setRecommendedMusics(userRecordDAO.findInfoByMusicNumbers(musicIds));
    	// Youtube API 할당량 초과...
>>>>>>> b3054e265e23a20714f9cf78202e02bab54a7e75
//    	List<YoutubeVideoDTO> youtubeVideoDTOs = new ArrayList<>();
//        
//        for (int i = 0; i < dto.getRecommendedMusics().size(); i++) {
//            String videoName = dto.getRecommendedMusics().get(i).getMusicName();
//            List<Map<String, String>> videos = null;
//
//            try {
//                videos = new ArrayList<>();
//                videos.add(youtubeService.searchVideo(videoName));
//            } catch (IOException e) {
//                e.printStackTrace();
//                videos = Collections.emptyList();
//            }
//
//            if (!videos.isEmpty()) {
//                Map<String, String> videoData = videos.get(0);
//                YoutubeVideoDTO videoDTO = new YoutubeVideoDTO(
//                    videoData.get("title"),
//                    videoData.get("channel"),
//                    videoData.get("thumbnail"),
//                    videoData.get("videoUrl")
//                );
//                youtubeVideoDTOs.add(videoDTO);
//            }
//        }
//    	
//        dto.setYoutubeSearchResults(youtubeVideoDTOs);
<<<<<<< HEAD

		log.info("UserRecordServiceImpl : " + dto);

		return dto;
	}
=======
>>>>>>> b3054e265e23a20714f9cf78202e02bab54a7e75

//    @Override
//    public List<UserRecordDTO> getLatestRecords() {
//    	return userRecordDAO.findLatestRecords();
//    }
	@Override
	public List<UserRecordDTO> getLatestRecords() {
		List<UserRecordDTO> list = userRecordDAO.findLatestRecords();

		for (int i = 0; i < list.size(); i++) {
			UserRecordDTO record = list.get(i);
			if (record != null) { // findLatestRecords()에서 가져온 레코드가 null일 가능성은 낮지만, 방어적으로 체크
				UserRecordDTO fullRecord = findById(record.getId()); // findById 호출하여 모든 정보를 채움
				if (fullRecord != null) {
					list.set(i, fullRecord); // 채워진 DTO로 리스트의 요소를 업데이트
					log.info("list {}: {}", i, list.get(i));
				}
			}
		}
		return list;
	}

	public List<Long> parseIds(String ids) {
		return Arrays.stream(ids.split(",")).map(String::trim).map(Long::parseLong).collect(Collectors.toList());
	}
}
