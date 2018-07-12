
Page({
    
    data: {
        tabIndex: 'hots'
    },

    // 生命周期函数
    onLoad: function () {

        // 保留外的 this
        var self = this;

        // 当页面加载完成后，获得用户的位置
        wx.getLocation({
            success: function (res) {
                // console.log(res);

                var latitude = res.latitude.toFixed(5),
                    longitude = res.longitude.toFixed(5);

                // 只能获得用户的经纬度，需要进一步的
                // 推算出具体的城市

                // 其推算过程可以通过访问(请求)接口来实现
                wx.request({
                    url: 'https://wx.maoyan.com/hostproxy/locate/v2/rgeo',
                    data: {
                        coord: [latitude, longitude, 1].join(',')
                    },
                    header: {
                        'x-host': 'http://apimobile.vip.sankuai.com',
                    },
                    method: 'get',
                    success: function (info) {
                        // info 即获取所在城市的信息
                        // console.log(info.data.data.city);

                        // 添加数据模型
                        self.setData({
                            city: info.data.data.city
                        });
                    }
                });
            }
        });
    },

    switch: function (ev) {
        // console.log(ev);

        // 通过 自定义属性 tabIndex 的值来
        // 判断用户的点击
        var tabIndex = ev.target.dataset.tabIndex;

        // 通过 setData 来实现 data 数据的更改
        // 需要传入对象类型的参数
        this.setData({
            tabIndex: tabIndex
        });
    },

    // 监听用户下拉操作
    onPullDownRefresh: function () {
        console.log('有人下拉了...');
    }
});