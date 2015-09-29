package com.minisoft.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.minisoft.common.Cols;
import com.minisoft.model.Menu;
import com.minisoft.model.User;
import com.minisoft.service.RoleService;

/**
 * BlogController 所有 sql 与业务逻辑写在 Model 或 Service 中，不要写在 Controller
 * 中，养成好习惯，有利于大型项目的开发与维护
 */
public class UserController extends BaseController {
    private RoleService roleService = new RoleService();

    public void defaultright() {
        User user = getLoginUser();
        List<Menu> menus = roleService.getMenusByUser(user);
        Map<String, String> map = new HashMap<String, String>();
        map.put("loginUser", user.getStr(Cols.name));
        for (Menu menu : menus) {
            map.put(menu.getStr(Cols.permission), "1");
        }
        renderJson(map);
    }
}