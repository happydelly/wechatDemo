package com.wechat.controller;

import com.wechat.utils.RedisOperator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BasicController {
	
	@Autowired
	public RedisOperator redis;
	
	public static final String USER_REDIS_SESSION = "user-redis-session";

	public static final String TEST = "test1";
	// 文件保存的命名空间
	public static final String FILE_SPACE = "D:/wechat_videos_dev";
	
	// ffmpeg所在目录
	public static final String FFMPEG_EXE = "D:\\coding\\resources\\ffmpeg\\ffmpeg\\bin\\ffmpeg.exe";
	
	// 每页分页的记录数
	public static final Integer PAGE_SIZE = 5;
	
}
