
Page({

    send: function () {

        // 在小程序中可以通过 wx.request 方法发起
        // 网络请求并接收处理响应的数据

        // 需要一个对象类型的参数
        wx.request({
            // 网络地址
            url: "https://www.baidu.com/",
            // 请求时传递的参数
            data: {},
            // 发起请求时的请求方式 get/post
            method: 'get',
            // 处理成功响应的结果
            success: function (info) {
                console.log(info);
            }
        });
    },

    getLocation: function () {
        console.log('获得用户经纬度...');

        // 在小程序中 通过 wx.getLocation 方法
        // 可以获得用户所在位置的经纬度
        // 需要用户授权

        // 需要传入对象类型的数据
        wx.getLocation({
            // 当获取成功后调用的函数
            success: function (res) {
                console.log(res);
            }
        });
    },

    loading:function () {

        // 在 小程序中 可以 调用 wx.showLoading 方法
        // 显示状态

        // 需要传入 对象类型数据
        wx.showLoading({
            title: '正在加载...'
        });

        setTimeout(function () {
            wx.hideLoading();
        }, 2000);
    },

    toast: function () {
        // 在 小程序中 可以 调用 wx.showToast 方法
        // 显示状态

        // 需要传入 对象类型数据
        wx.showToast({
            title: '提交完成'
        })
    },

    sheet: function () {

        wx.showActionSheet({
            itemList: [
                '相册',
                '拍照'
            ]
        })
    }
});