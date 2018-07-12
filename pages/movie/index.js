
Page({
    
    data: {
        tabIndex: 'hots',
        limit: 12,
        page: 1
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

                        // 根据用户所在城市，获得相应的热门电影
                        wx.request({
                            url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
                            data: {
                                // 用户所在城市
                                ct: info.data.data.city,
                                // 获取数据的条数
                                limit: 12,
                                // 获取数据的位置
                                offset: 0
                            },
                            method: 'get',
                            success: function (hots) {
                                // 响应的数据
                                // console.log(hots);

                                // 遍历处理数据，将 w.h 替换成 128.180
                                // 即需要的图片尺寸
                                hots.data.data.hot.forEach(function (val) {
                                    val.img = val.img.replace('w.h', '128.180');
                                });

                                // 添加数据
                                self.setData({
                                    hots: {
                                        items: hots.data.data.hot,
                                        hasMore: hots.data.data.paging.hasMore
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    // 上拉触底
    onReachBottom: function () {
        // console.log('上拉触底了...');

        var self = this;

        var hasMore = self.data.hots.hasMore;

        if(!hasMore) return;

        // 在小程序中通过 this.data 可以获得 data 中的
        // 数据
        // console.log(this.data);

        // 0 - 11

        // 12 - 23

        // 24 - 35

        // 36 - 47

        // 去请求更多的数据
        wx.request({
            url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
            data: {
                ct: self.data.city,
                limit: self.data.limit,
                offset: self.data.limit * self.data.page
            },
            method: 'get',
            success: function (info) {
                // console.log(info);

                // 替换图片尺寸
                info.data.data.hot.forEach(function (val) {
                    val.img = val.img.replace('w.h', '128.180');
                })

                // 将新请求来的数据追加至原有数据中
                // console.log(self.data)
                var items = self.data.hots.items.concat(info.data.data.hot);

                // console.log(items);
                // 添加数据
                self.setData({
                    page: ++self.data.page,
                    hots: {
                        items: items,
                        hasMore: info.data.data.paging.hasMore
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