
Page({
    
    data: {
        tabIndex: 'hots',
        coming: {
            empty: true
        },
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

                        // 加载状态
                        wx.showLoading({
                            title: '数据加载...'
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
                                        hasMore: hots.data.data.paging.hasMore,
                                        empty: false
                                    },
                                });

                                // 加载完成
                                wx.hideLoading();
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

        var self = this;

        // 通过 自定义属性 tabIndex 的值来
        // 判断用户的点击
        var tabIndex = ev.target.dataset.tabIndex;

        // 通过 setData 来实现 data 数据的更改
        // 需要传入对象类型的参数
        this.setData({
            tabIndex: tabIndex
        });

        // 当点击 tab 时，检测当前 tab 对应的数据
        // 是否存在，如果已存在不必发请求，相反如果
        // 没有数据，则发送请求

        var empty = this.data[tabIndex].empty;

        // 如果已经有数据，那么不必重新请求
        if(!empty) return;

        if(tabIndex == 'hots') {
            // 热门电影
            console.log('请求执映数据...');
        }

        if(tabIndex == 'coming') {
            // 待映
            console.log('请求待映数据...');

            // 请求最受欢迎
            wx.request({
                url: 'https://wx.maoyan.com/mmdb/movie/v1/list/wish/order/coming.json',
                data: {
                    ci: 1,
                    limit: 30,
                    offset: 0
                },
                method: 'get',
                success: function (v1) {
                    // console.log(v1);

                    // 替图片尺寸
                    v1.data.data.coming.forEach(function (val) {
                        val.img = val.img.replace('w.h', '170.230');

                        val.comingTitle = val.comingTitle.slice(0, -3);
                    });

                    // 待映电影列表
                    wx.request({
                        url: 'https://wx.maoyan.com/mmdb/movie/v2/list/rt/order/coming.json',
                        data: {
                            ci: 1,
                            limit: 10
                        },
                        method: 'get',
                        success: function (v2) {
                            // console.log(v2);

                            // 替图片尺寸
                            var title = '';
                            v2.data.data.coming.forEach(function (val) {
                                val.img = val.img.replace('w.h', '128.180');
                                
                                if(val.comingTitle == title) {
                                    val.comingTitle = '';
                                } else {
                                    title = val.comingTitle;
                                }
                                
                            });

                            // console.log(v2);

                            // 添加数据
                            self.setData({
                                coming: {
                                    v1: {
                                        items: v1.data.data.coming
                                    },
                                    v2: {
                                        items: v2.data.data.coming
                                    },
                                    empty: false
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    // 监听用户下拉操作
    onPullDownRefresh: function () {
        console.log('有人下拉了...');

        var self = this;

        // 发送请求获取最新的数据
        // 最新数据其实就是 第 1 页数据
        wx.request({
            url: 'https://wx.maoyan.com/mmdb/movie/v2/list/hot.json',
            data: {
                ct: self.data.city,
                limit: 12,
                offset: 0
            },
            method: 'get',
            success: function (info) {
                // console.log(info);

                // 替换图片尺寸
                info.data.data.hot.forEach(function (val) {
                    val.img = val.img.replace('w.h', '128.180');
                })

                // 添加数据
                self.setData({
                    hots: {
                        items: info.data.data.hot,
                        // 有没有下一页
                        hasMore: info.data.data.paging.hasMore
                    },
                    // 刷新后页码恢复到 第 1 页
                    page: 1
                });
            }
        });
    }
});