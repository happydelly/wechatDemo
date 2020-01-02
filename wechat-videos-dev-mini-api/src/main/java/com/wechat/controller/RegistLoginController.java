package com.wechat.controller;

import com.wechat.pojo.Users;
import com.wechat.pojo.vo.UsersVO;
import com.wechat.pojo.vo.WxSessionModel;
import com.wechat.service.UserService;
import com.wechat.utils.HttpClientUtil;
import com.wechat.utils.IMoocJSONResult;
import com.wechat.utils.JsonUtils;
import com.wechat.utils.MD5Utils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@Api(value="用户注册登录的接口", tags= {"注册和登录的controller"})
public class RegistLoginController extends  BasicController{

    @Autowired
    private UserService userService;

    @ApiOperation(value="用户注册", notes="用户注册的接口")
    @PostMapping("/regist")
    public IMoocJSONResult regist(@RequestBody Users user) throws Exception {

        // 1. 判断用户名和密码必须不为空
        if (StringUtils.isBlank(user.getUsername()) || StringUtils.isBlank(user.getPassword())) {
            return IMoocJSONResult.errorMsg("用户名和密码不能为空");
        }

        // 2. 判断用户名是否存在
        boolean usernameIsExist = userService.queryUsernameIsExist(user.getUsername());

        // 3. 保存用户，注册信息
        if (!usernameIsExist) {
            user.setNickname(user.getUsername());
            user.setPassword(MD5Utils.getMD5Str(user.getPassword()));
            user.setFansCounts(0);
            user.setReceiveLikeCounts(0);
            user.setFollowCounts(0);
            userService.saveUser(user);
        } else {
            return IMoocJSONResult.errorMsg("用户名已经存在，请换一个再试");
        }

        user.setPassword("");

//		String uniqueToken = UUID.randomUUID().toString();
//		redis.set(USER_REDIS_SESSION + ":" + user.getId(), uniqueToken, 1000 * 60 * 30);
//
//		UsersVO userVO = new UsersVO();
//		BeanUtils.copyProperties(user, userVO);
//    	userVO.setUserToken(uniqueToken);

        UsersVO userVO = setUserRedisSessionToken(user);

        return IMoocJSONResult.ok(userVO);
    }

    public UsersVO setUserRedisSessionToken(Users userModel) {
        String uniqueToken = UUID.randomUUID().toString();
//        redis.set(USER_REDIS_SESSION + ":" + userModel.getId(), uniqueToken, 1000 * 60 * 30);
        redis.set(USER_REDIS_SESSION + ":" + userModel.getId(), uniqueToken, 1800);
        UsersVO userVO = new UsersVO();
        BeanUtils.copyProperties(userModel, userVO);
        userVO.setUserToken(uniqueToken);
        return userVO;
    }

    public WxSessionModel setUserRedisSessionToken(WxSessionModel model) {
        String uniqueToken = UUID.randomUUID().toString();
//        redis.set(USER_REDIS_SESSION + ":" + userModel.getId(), uniqueToken, 1000 * 60 * 30);
        redis.set(USER_REDIS_SESSION + ":" + model.getOpenid(),model.getSession_key(), 1800);

        return model;
    }


    @ApiOperation(value="用户登录", notes="用户登录的接口")
    @PostMapping("/login")
    public IMoocJSONResult login(@RequestBody Users user) throws Exception {
        String username = user.getUsername();
        String password = user.getPassword();

        // 1. 判断用户名和密码必须不为空
        if (StringUtils.isBlank(username) || StringUtils.isBlank(password)) {
            return IMoocJSONResult.ok("用户名或密码不能为空...");
        }

        // 2. 判断用户是否存在
        Users userResult = userService.queryUserForLogin(username,
                MD5Utils.getMD5Str(user.getPassword()));

        // 3. 返回
        if (userResult != null) {
            userResult.setPassword("");
            UsersVO userVO = setUserRedisSessionToken(userResult);
            return IMoocJSONResult.ok(userVO);
        } else {
            return IMoocJSONResult.errorMsg("用户名或密码不正确, 请重试...");
        }
    }

//    @ApiImplicitParam(name="userId", value="用户id", required=true,
//            dataType="String", paramType="query")
    @ApiOperation(value="用户注销", notes="用户注销的接口")
    @PostMapping("/logout")
    public IMoocJSONResult logout(@RequestParam(value = "userId",required = true) String userId) throws Exception {
        redis.del(USER_REDIS_SESSION + ":" + userId);
        return IMoocJSONResult.ok();
    }

    @PostMapping("/wxLogin")
    public IMoocJSONResult wxLogin(@RequestParam("code") String code){

        System.out.println("wxlogin - code" +code);

        //GET https://api.weixin.qq.com/sns/jscode2session?
        // appid=APPID&
        // secret=SECRET&
        // js_code=JSCODE&
        // grant_type=authorization_code
        Map<String, String> param = new HashMap<>();
        param.put("appid","wx645bcc5cb188eca6");
        param.put("secret","316d741c21a23730835856108a12e1f8");
        param.put("js_code",code);
        param.put("grant_type","authorization_code");
        String result = HttpClientUtil.doGet("https://api.weixin.qq.com/sns/jscode2session",param);

        WxSessionModel model = JsonUtils.jsonToPojo(result, WxSessionModel.class);

        //存入session到redis
        setUserRedisSessionToken(model);
        return IMoocJSONResult.ok(model);
    }


}
