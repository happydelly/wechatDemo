package com.wechat.utils;

import java.util.Random;

public class KeyUtils {

    /**
     * 生成唯一主键
     */
    public static synchronized String genUniqueKey() {
        Random random = new Random();
        int number = random.nextInt(900000) + 1000000;
        return System.currentTimeMillis() + String.valueOf(number);
    }

}
