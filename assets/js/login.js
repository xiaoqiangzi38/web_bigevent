$(function () {
    // 点击'去注册账号'的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击'去登录'的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })


    // 从layui中获取layer对象
    var layer = layui.layer;
    // 从layui中获取form对象
    var form = layui.form;
    // 通过 form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个 pwd 校验规则
        pwd: [/^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'],
        // 自定义一个 repwd 确认密码校验规则
        repwd: function (value) {
            // 确认密码框将使用这个规则，所以形参拿到的是确认密码框的值

            // 先拿到密码框的值
            var pwd = $('.reg-box [name=password]').val();
            // 比较两次输入密码是否一致，如果不一致就return 提示消息
            if (value != pwd) {
                return '两次密码不一致！';
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止默认提交事件
        e.preventDefault();
        // 发起ajax的post请求
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser', data, function (res) {
            // 如果status不等于0，表示注册失败
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            // 否则，就是注册成功
            layer.msg('注册成功，请登录');
            // 手动调用 '去登录' 的点击事件，打开登录框
            $('#link_login').click();
        })
    })


    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax的Post请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // 登录成功后将返回的token保存到本地存储中 locationStorage
                localStorage.setItem('token', res.token);
                // 跳转到后台首页
                location.href = '/index.html';
            }
        })
    })
})