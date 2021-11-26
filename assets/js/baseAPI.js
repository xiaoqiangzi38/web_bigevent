// 在发起 $.get 或 $.post 或 $.ajax 的时候
// 会先调用这个方法 $.ajaxPrefilter()
// 这个方法中能够拿到我们请求的page对象，即回调函数中的参数options
// 在回调函数中，我们进行 url根路径的拼接
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})