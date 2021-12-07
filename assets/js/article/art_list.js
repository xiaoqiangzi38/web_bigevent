$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = padZero(dt.getFullYear());
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义时间补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象 q，将来请求数据的时候
    // 需要将请求参数对象发送到服务器
    var q = {
        pagenum: 1,   // 页码值，默认请求第一页的数据
        pagesize: 2,  // 每页显示几条数据，默认每页显示两条
        cate_id: '',  // 文章分类的 Id
        state: ''     // 文章的发布状态
    }

    initTable();
    initCate();


    // 封装函数获取文章列表数据并渲染
    function initTable() {
        // 判断本地存储中有无当前页码值
        var num = localStorage.getItem('num');
        if (num) {
            q.pagenum = num;

            // 清除本地存储中的页码值
            localStorage.removeItem('num');
        }
        // 发起求拿数据
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                // 渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                // 调用渲染分页方法
                renderPage(res.total)
            }
        })
    }


    // 封装函数初始化 '所有分类' 下拉框选项
    function initCate() {
        // 发起请求
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引擎渲染分类数据
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);

                // 别忘记调用form.render()方法，让layui重新渲染一下表单结构。因为我们是动态的往select里面加了一些可选项，为了让layui.js能够监听到往select里面加了可选项的动作，所以填充号内容以后要调用form.render()方法，
                // 如果不调用就看不到可选项
                form.render();
            }
        })
    }


    // 监听筛选区域表单的提交事件
    $('#form-search').on('submit', function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 获取表单内可选项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 给查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染列表区域数据
        initTable();
    })


    // 给 '重置' 按钮绑定点击事件
    $('#form-reset').on('click', function () {
        // 重置查询参数 q 中的属性值
        q.cate_id = '';
        q.state = '';
        q.pagenum = 1;
        // 根据最新的筛选条件，重新渲染列表区域数据
        initTable();
    })


    // 封装函数渲染分页区域内容
    function renderPage(total) {
        // 调用laypage.render()方法，渲染分页的结构
        laypage.render({
            elem: 'pageBox',  // 分页容器的id
            count: total,  // 总数据条数
            limit: q.pagesize,  // 每页显示的条数
            curr: q.pagenum,  // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 当分页发生切换的时候，就会触发jump函数方法

            // 触发jump回调的方式有两种：
            // 1.点击页码的时候，就会触发jump回调
            // 2.只要调用了laypage.render()方法，也会触发jump回调
            jump: function (obj, first) {
                // 可以通过first的值来判断，到底是哪种方式触发的jump回调
                // 如果first的值为true，就是方式2触发的，我们就不应该调用渲染列表区域的方法
                // 否则就是方式1触发的

                // 将最新的页码值，赋值给 q 这个查询对象中
                q.pagenum = obj.curr;

                // 将最新的条目数，赋值给 q 这个查询对象的pagesize属性
                q.pagesize = obj.limit;

                // 判断：当是方式1触发的jump回调，就调用渲染列表区域方法
                if (!first) {
                    initTable();
                }
            }
        })
    }


    // 通过代理的方式，给 '删除' 按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取页面上 '删除' 按钮的个数
        var len = $('.btn-delete').length;
        // 获取当前文章的id
        var id = $(this).attr('data-id');
        // 询问用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起请求
            $.ajax({
                url: '/my/article/delete/' + id,
                method: 'GET',
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 当文章删除成功后，需要判断当前页码还有没有文章，
                    // 如果没有文章了，我们就需要将当前页码值减1，
                    // 重新调用initTable()方法，渲染上一页的文章列表

                    if (len == 1) {
                        // 如果len的值等于1，说明删除成功之后，页面上就没有文章了
                        // 这时需要注意，页码值最小必须是1 (即等于1时就不能减了)
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    // 重新渲染文章列表区域
                    initTable();
                }
            })
            // 关闭询问层
            layer.close(index);
        });
    })


    // 通过代理的方式，给 '编辑' 按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // 获取当前文章的id
        var id = $(this).attr('data-id');
        // 根据文章的id，拿到该文章的数据
        $.ajax({
            url: '/my/article/' + id,
            method: 'GET',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败！');
                }
                // 将文章数据存入本地储存中
                var artData = JSON.stringify(res.data);
                localStorage.setItem('data', artData);
                // 将当前页面中存入本地存储中
                localStorage.setItem('num', q.pagenum);
                // 跳转到文章修改页面
                location.href = '/article/art_edit.html';
            }
        })
    })
})