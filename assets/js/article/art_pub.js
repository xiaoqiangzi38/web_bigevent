$(function () {

    var layer = layui.layer;
    var form = layui.form;

    initCate();

    // 初始化富文本编辑器
    initEditor();

    // 封装函数加载文章分类
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('select').html(htmlStr);

                // 别忘记调用form.render()方法，让layui重新渲染一下表单结构。因为我们是动态的往select里面加了一些可选项，为了让layui.js能够监听到往select里面加了可选项的动作，所以填充号内容以后要调用form.render()方法，
                // 如果不调用就看不到可选项
                form.render();
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click', function () {
        // 手动调用文件选择框的点击事件
        $('#coverFile').click();
    })


    // 监听文件选择框的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取文件列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length == 0) {
            return
        }
        // 将文件转化为url路径
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    var art_state = '已发布';

    // 为 存为草稿 按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })


    // 监听表单的提交事件
    $('#form_pub').on('submit', function (e) {
        // 1.阻止默认提交行为
        e.preventDefault();
        // 2.基于form表单，快速创建一个formData对象(注意：需要先将jquery对象转化为原生对象，才能使用new FormData)
        var fd = new FormData($(this)[0]);
        // 3.将文章发布状态追加到fd对象中
        fd.append('state', art_state);


        // 4.将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 5.将裁剪后的图片文件追加到fd对象中
                fd.append('cover_img', blob);

                // 6.发起ajax数据请求
                publishArticle(fd);
            })
    })


    // 封装发布文章的函数
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            method: 'POST',
            data: fd,
            // 注意：如果向服务器提交的是 formData 格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 跳转到文章列表页面
                location.href = '/article/art_list.html';
            }
        })
    }
}) 