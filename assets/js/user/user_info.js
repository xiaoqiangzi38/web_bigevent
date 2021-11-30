$(function () {
    var form = layui.form;
    var layer = layui.layer;


    // 自定义校验规则
    form.verify({
        // 自定义用户昵称校验规则
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！';
            }
        }
    })


    initUserInfo();
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }

                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }


    // 点击重置按钮功能
    $('#btnReset').on('click', function (e) {
        // 阻止默认重置行为
        e.preventDefault();
        // 重新初始化用户信息
        initUserInfo();
    })


    // 监听form表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }

                layer.msg('更新用户信息成功！');
                // 更新用户信息成功后，如何实时将信息渲染出来呢？
                // 当前我们所在的页面是 user_info.html中，而它又存在于index.html页面的iframe标签内，相当于user_info.html是index.html的子页面
                // 我们现在想调用父页面index.html的getUserInfo()方法，获取用户信息并渲染用户头像等
                // 这就需要用到 window.parent
                window.parent.getUserInfo();
            }
        })
    })
})