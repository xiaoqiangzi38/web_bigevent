$(function () {

    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    // 封装函数获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }


    // 给 '添加类别' 按钮绑定点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        // '添加类别' 的弹出层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类'
            , content: $('#dialog-add').html()
        });
    })


    // 因为添加分类的form表单是后期创建的，所以只能
    // 通过代理的方式给它绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败！');
                }
                layer.msg('添加分类成功！');
                // 重新获取文章分类列表
                initArtCateList();
                // 通过layer.close(index) 对应的索引 关闭弹出层
                layer.close(indexAdd);
            }
        })
    })


    // 通过代理的方式给 '编辑' 按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        // '编辑' 的弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类'
            , content: $('#dialog-edit').html()
        });

        // 获取 '编辑' 所在框的Id
        var id = $(this).attr('data-id');
        // 根据 id 发起ajax请求，获取对应的数据
        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'GET',
            success: function (res) {
                // 使用layui的 form.val()方法快速填充表单内容
                form.val('form-edit', res.data);
            }
        })
    })


    // 通过代理的方式给 '编辑' 按钮的弹出层中的表单form，绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新文章分类失败！');
                }
                layer.msg('更新文章分类成功！');
                // 根据id关闭弹出层
                layer.close(indexEdit);
                // 获取文章分类列表
                initArtCateList();
            }
        })
    })


    // 通过代理的方式给 '删除' 按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 拿到 '删除' 按钮所在项的Id
        var id = $(this).attr('data-id');
        // 弹出询问框，是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 用户点击了确定
            // 发起ajax请求
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'GET',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    // 关闭询问框
                    layer.close(index);
                    // 更新分类列表
                    initArtCateList();
                }
            })
        });
    })
})