'use strict';


app.config({

    /*
    |--------------------------------------------------------------------------
    | Provide
    |--------------------------------------------------------------------------
    |
    | Specify an array of the name of vendors that should be load in all pages.
    | Visit following URL to see a list of available vendors.
    |
    | https://thetheme.io/theadmin/help/article-dependency-injection.html#provider-list
    |
    */

    provide: ['typeahead'],


    /*
    |--------------------------------------------------------------------------
    | Smooth Scroll
    |--------------------------------------------------------------------------
    |
    | By changing the value of this option to true, the browser's scrollbar
    | moves smoothly on scroll.
    |
    */

    smoothScroll: false,

    /*
    |--------------------------------------------------------------------------
    | Save States
    |--------------------------------------------------------------------------
    |
    | If you turn on this option, we save the state of your application to load
    | them on the next visit (e.g. make topbar fixed).
    |
    | Supported states: Topbar fix, Sidebar fold
    |
    */

    saveState: false,


});

app.dir.vendor = 'http://localhost:3000/assets/vendor/';


/*
|--------------------------------------------------------------------------
| Application Is Ready
|--------------------------------------------------------------------------
|
| When all the dependencies of the page are loaded and executed,
| the application automatically call this function. You can consider it as
| a replacer for jQuery ready function - "$( document ).ready()".
|
*/

app.ready(function () {

    /*
    |--------------------------------------------------------------------------
    | Plugins
    |--------------------------------------------------------------------------
    |
    | Import initialization of plugins that used in your application
    |
    */


    /*
     * Search in Theadmin components
     */
    if (window["Bloodhound"]) {
        var theadminComponents = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('tokens'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: {
                url: app.dir.assets + 'data/json/files.json',
                cache: false
            }
        });

        $('#theadmin-search input').typeahead(null, {
            name: 'theadmin-components',
            display: 'title',
            source: theadminComponents,
            templates: {
                suggestion: function (data) {
                    return '<a href="' + location.origin + '/' + data.url + '"><h6 class="mb-1">' + data.title + '</h6><small>' + data.description + '</small></a>';
                }
            }
        });

        $('#theadmin-search input').bind('typeahead:select', function (ev, data) {
            window.location.href = location.origin + '/' + data.url;
        });

        $('#theadmin-search input').bind('typeahead:open', function (ev, data) {
            $(this).closest('#theadmin-search').find('.lookup-placeholder span').css('opacity', '0');
        });

        $('#theadmin-search input').bind('typeahead:close', function (ev, data) {
            if ($(this).val() == "") {
                $(this).closest('#theadmin-search').find('.lookup-placeholder span').css('opacity', '1');
            }
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Color Changer
    |--------------------------------------------------------------------------
    |
    | This is a tiny code to implement color changer for our demonstrations.
    |
    */

    var demo_colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'purple', 'pink', 'cyan', 'yellow', 'brown', 'dark'];


    /*
     * Color changer using base pallet name
     */
    $('[data-provide~="demo-color-changer"]').each(function () {
        var target = $(this).data('target'),
            baseClass = $(this).data('base-class'),
            html = '',
            name = $(this).dataAttr('name', ''),
            checked = $(this).dataAttr('checked', ''),
            exclude = $(this).dataAttr('exclude', ''),
            prefix = '';

        if ($(this).hasDataAttr('pale')) {
            prefix = 'pale-';
        }

        if (name == '') {
            name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        }

        html = '<div class="color-selector color-selector-sm">';

        $.each(demo_colors, function (i, key) {

            // Check if we need to exclude any code
            if (exclude.indexOf(key) > -1) {
                return;
            }

            var color = prefix + key;
            html += '<label' + (prefix === 'pale-' ? ' class="inverse"' : '') + '><input type="radio" value="'
                + color + '" name="' + name + '"' + (checked === key ? ' checked' : '') + '><span class="bg-'
                + color + '"></span></label>';
        });

        html += '</div>';

        $(this).replaceWith(html);

        // Listen to the change event of checkboxes
        $(document).on('change', 'input[name="' + name + '"]', function () {
            var val = $('input[name="' + name + '"]:checked').val();
            $(target).attr('class', baseClass + val);
        });
    });

// Page: pinpailist.html
// Add a new fenlei row in "create new fenlei"
    $(document).on('click', '#btn-new-pinpai', function () {
        var html = '' +
            '<div class="form-group row align-items-center">' +
            '<div class="col-md-5">' +
            '<select class="form-control">' +
            '<option>一级分类</option>' +
            '<option>Ketchup</option>' +
            '<option>Relish</option>' +
            '<option>Relish</option>' +
            '</select>' +
            '</div>' +
            '<div class="col-md-5">' +
            '<select class="form-control">' +
            '<option>二级分类</option>' +
            '<option>Ketchup</option>' +
            '<option>Relish</option>' +
            '<option>Relish</option>' +
            '</select>' +
            '</div>' +
            '<a class="text-danger pl-12" id="btn-remove-pinpai" href="#" title="Remove" data-provide="tooltip"><i class="ti-close"></i></a>' +
            '</div>';

        $(this).before(html);
    });


// Page: pinpailist.html
// Remove an fenlei row in "create new fenlei"
    $(document).on('click', '#btn-remove-pinpai', function () {
        $(this).closest('.form-group').fadeOut(function () {
            $(this).remove();
        });
    });
//判断是否填写再弹框
    // Delete delivery
    $(document).on('click', '#confirm_delivery', function () {
        var url = $(this).data('target');
        var ids = '';
        var item = $(this);
        var value1 = $('#ordernumber').val();
        var value2 = $('#orderfirm').val();

        if (value1 != "" && value2 != "") {
            app.modaler({
                html: '确认发货？确认后订单状态将变为已发货，且不可逆',
                type: 'top',
                size: 'sm',
                title: '确认发货',
                confirmText: '确认',
                cancelVisible: true,
                cancelText: '取消',
                onConfirm: function (modal) {
                    $('form').submit()
                }
            });
        }
    });

    // Delete delivery
    $(document).on('click', '#confirm_arriv', function () {
        var url = $(this).data('target');
        var ids = '';
        var item = $(this);
        var value1 = $('#ordernumber').val();
        var value2 = $('#orderfirm').val();
        app.modaler({
            html: '确认到货？确认后订单状态将变为已到货，且不可逆',
            type: 'top',
            size: 'sm',
            title: '确认到货',
            confirmText: '确认',
            cancelVisible: true,
            cancelText: '取消',
            onConfirm: function (modal) {
                $('#arriv_foot').hide()
            }
        });
    });

// Delete remove
    $(document).on('click', '[data-perform="delete-remove"]', function () {
        var url = $(this).data('target');
        var ids = '';
        var item = $(this);

        app.modaler({
            html: '确认清空任务组？清空后，采集数据将重新同步！',
            type: 'top',
            size: 'sm',
            title: '确认清空',
            confirmText: 'Yes,清空！',
            cancelVisible: true,
            cancelText: '取消',

            onConfirm: function (modal) {

                if (item.closest('tr').length) {
                    ids = item.closest('tr').fadeOut(900).data('id');
                }
                else {
                    ids = item.closest('.media').fadeOut(900).data('id');
                }

                $.post(url, {id: ids}, function (data) {
                    // On success
                    app.toast('已成功删除')
                });
            }
        });
    });

// Delete single
    $(document).on('click', '[data-perform="delete-single"]', function () {
        var url = $(this).data('target');
        var ids = '';
        var item = $(this);

        app.modaler({
            html: '确认删除？删除后数据将无法恢复！',
            type: 'top',
            size: 'sm',
            title: '确认删除',
            confirmText: 'Yes,删除！',
            cancelVisible: true,
            cancelText: '取消',

            onConfirm: function (modal) {

                if (item.closest('tr').length) {
                    ids = item.closest('tr').fadeOut(900).data('id');
                }
                else {
                    ids = item.closest('.media').fadeOut(900).data('id');
                }

                $.post(url, {id: ids}, function (data) {
                    // On success
                    app.toast('已成功删除')
                });
            }
        });
    });
    //重置
    $('#resetBtn').on('click', function () {
        $('.value_reset').val('')
        $('select').selectpicker('val',['一级分类','二级分类','品牌','全部来源'])
        $('#order_statu').selectpicker('val',['订单状态'])
    })
});
