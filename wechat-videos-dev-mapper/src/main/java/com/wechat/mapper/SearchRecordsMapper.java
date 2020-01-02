package com.wechat.mapper;

import com.wechat.pojo.SearchRecords;
import com.wechat.utils.MyMapper;

import java.util.List;


public interface SearchRecordsMapper extends MyMapper<SearchRecords> {
	
	public List<String> getHotwords();
}