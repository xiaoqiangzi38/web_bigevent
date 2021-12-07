$(function () {
    var layer = layui.layer;
    var form = layui.form;

    // 初始化富文本编辑器
    initEditor()


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 第一行内容填充
    var artData = localStorage.getItem('data');
    var artDataObj = JSON.parse(artData);
    $('[name=title]').val(artDataObj.title);


    // 第二行内容填充
    var id = artDataObj.cate_id;
    $.ajax({
        url: '/my/article/cates',
        method: 'GET',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章类别失败！');
            }
            // 调用模板渲染文章类别
            var htmlStr = template('art-cate', res);
            $('select').html(htmlStr);
            // 调用form.render()方法，重新渲染下拉框
            $('[value=' + id + ']').prop("selected", "selected");
            form.render();
        }
    })


    // 第三行内容填充
    var con = artDataObj.content;
    $('textarea').val(con);


    // 给 '选择封面' 按钮绑定点击事件
    $('.btnChooseImage').on('click', function () {
        // 手动调用文件选择框的点击事件
        $('#fileChoose').click();
    })


    // 监听文件选择框的change事件
    $('#fileChoose').on('change', function (e) {
        // 获取选择的文件列表
        var files = e.target.files;
        // 将选择的文件转化为url地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 定义文章发布状态
    var art_state = '已发布';
    // 给 '存为草稿' 按钮绑定点击事件，目的为了修改发布状态
    $('#btnSave2').on('click', function () {
        // 修改发布状态
        art_state = '草稿';
    })


    // 监听表单的提交事件
    $('#form_edit').on('submit', function (e) {
        // 1.阻止默认提交行为
        e.preventDefault();
        // 2.基于form表单，快速创建一个formData对象(注意：需要先将jquery对象转化为原生对象，才能使用new FormData)
        var fd = new FormData($(this)[0]);
        // 3.将文章的Id追加进去
        fd.append('Id', artDataObj.Id);
        // 4.将文章的发布状态追加进去
        fd.append('state', art_state);
        // 5.将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 6.将裁剪图片文件追加到fd中
                fd.append('cover_img', blob);

                // 7.发起请求修改文章信息
                articleEdit(fd);
            })
    })


    // 封装函数根据更新文章信息
    function articleEdit(fd) {
        $.ajax({
            url: '/my/article/edit',
            method: 'POST',
            data: fd,
            // 注意：如果向服务器提交的是 formData 格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改文章失败！');
                }
                layer.msg('修改文章成功！');
                // 清除本地存储中的文章信息
                localStorage.removeItem('data');
                // 跳转回列表页面
                location.href = '/article/art_list.html';
            }
        })
    }
})