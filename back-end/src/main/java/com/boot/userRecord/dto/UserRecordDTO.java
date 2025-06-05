package com.boot.userRecord.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRecordDTO {
    private long id;

    private int happy;
    private int sad;
    private int stress;
    private int calm;
    private int excited;
    private int tired;

    private String music_ids;
    private String action_ids;
    private String book_ids;

    private Date created_at;
}
