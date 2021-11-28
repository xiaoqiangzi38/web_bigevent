$(function () {
    // 调用函数获取用户信息
    getUserInfo();


    var layer = layui.layer;
    // 点击退出按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        // 提示框，是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清除本地存储中的token值
            localStorage.removeItem('token');
            // 2.跳转到登录页面
            location.href = '/login.html';

            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})

// 封装函数获取用户信息
function getUserInfo() {
    // 发起ajax的get请求
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // headers 就是请求头配置对象
        // headers: {
        //     // token值被保存在了本地存储中，在localStorage里面取到
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            // 调用函数渲染用户头像
            renderAvatar(res.data);
        }

        // 当发起ajax请求时，无论服务器响应成功还是失败，都会执行complete函数
        // complete: function (res) {
        //     // console.log('执行了complete回调函数：');
        //     // console.log(res);

        //     // 在回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
        //         // 1.强制清空 token
        //         localStorage.removeItem('token');
        //         // 2.强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}


// 封装函数渲染用户头像
function renderAvatar(user) {
    // 1.获取用户的名称 (优先显示用户的昵称nickname，如果没有昵称，就显示用户名username)
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 有图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 没有图片头像
        // 先拿到用户名的第一个字符，可能英文也可能中文，如果英文转换为大写
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }
}