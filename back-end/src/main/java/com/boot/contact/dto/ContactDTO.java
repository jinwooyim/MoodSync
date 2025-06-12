package com.boot.contact.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
	private int contactId;
	private int userNumber;
	private String contactTitle;
	private String contactContent;
}
