package com.boot.contact.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDTO {
	private int answerId;
	private int contactId;
	private int userNumber;
	private String answerContent;
	private Date createdDate;
	private Date updatedDate;
	private Date deletedDate;
	private String status;
}
