$(function () {
    var form = layui.form;

    // 自定义校验规则
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！';
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！';
            }
        }
    })


    // 监听form表单的提交事件
    $('.layui-form').submit(function (e) {
        // console.log(11);
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            url: '/my/updatepwd',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！');
                }
                layui.layer.msg('更新密码成功！');

                // 重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})