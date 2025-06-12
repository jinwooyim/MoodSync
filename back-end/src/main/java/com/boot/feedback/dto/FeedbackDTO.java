package com.boot.feedback.dto;

import java.sql.Date;

import com.boot.contact.dto.ContactDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDTO {
	private int feedbackId;
	private int userNumber;
	private String userName;
	private String feedbackCategory;
	private int feedbackScore;
	private String feedbackContent;
    private Date createdDate;
    private Date updatedDate; 
    private Date deletedDate;
    private String status;
}
