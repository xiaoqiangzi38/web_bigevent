// 在发起 $.get 或 $.post 或 $.ajax 的时候
// 会先调用这个方法 $.ajaxPrefilter()
// 这个方法中能够拿到我们请求的page对象，即回调函数中的参数options
$.ajaxPrefilter(function (options) {
    // 在回调函数中，我们进行 url根路径的拼接
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一为有权限的接口，设置请求头 headers
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            // token值被保存在了本地存储中，在localStorage里面取到
            Authorization: localStorage.getItem('token') || ''
        };
    }

    // 全局统一挂载 complete回调函数
    options.complete = function (res) {
        // console.log('执行了complete回调函数：');
        // console.log(res);

        // 在回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            // 1.强制清空 token
            localStorage.removeItem('token');
            // 2.强制跳转到登录页面
            location.href = '/login.html';
        }
    }
})