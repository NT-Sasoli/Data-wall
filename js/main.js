/**
 * Created by sasoli on 2018/2/9.
 */
let form = {
    'url': 'http://cd-screen.xinhuazhiyun.com/cm/',//http://cd-screen.xinhuazhiyun.com http://192.168.1.9:7779/xr-aries
    'userDateId': '',
    'userDate': '',
};
let cityList = new Array();
let newsBoxJson = [], oldNewsJson = [], commentsBoxJson = [], manuscriptBoxJson = [], informationBoxJson = [],
    cityNewsBoxJson = [], allQuantityJson = [];

$(document).ready(() => {
    getAllDateAjax();
    getCityAjax();

    /*上传所有数据*/
    $('.upAll').click(() => {
        if (form.userDateId == '') {
            alert('请选择日期');
            return
        }
        let dispatch = $('.dispatch').val(), reprint = $('.reprint').val(), read = $('.read').val(),
            remark = $('.remark').val(), good = $('.good').val(), id = $('.dispatch').attr('getId');
        let arr = {
            'dispatch': dispatch,
            'reprint': reprint,
            'read': read,
            'remark': remark,
            'good': good,
            'timeId': form.userDateId,
            'timeName': form.userDate,
            'id': id
        };
        allQuantityJson.push(arr);
        $('.newsBox').children('.record').each((i, e) => {
            let hot = $('.newsBox .hot').eq(i).val(), tlt = $('.newsBox .tlt').eq(i).val(),
                inst = $('.newsBox .institution').eq(i).val(),
                type = $('.newsBox .position option:selected').eq(i).attr('value'),
                id = $('.newsBox .record').eq(i).attr('getId');
            let arr = {
                'spread': hot,
                'title': tlt,
                'inst': inst,
                'type': type,
                'timeId': form.userDateId,
                'id': id
            };
            newsBoxJson.push(arr);
        });
        /*================*/
        $('.oldNews').children('.record').each((i, e) => {
            let hot = $('.oldNews .hot').eq(i).val(), tlt = $('.oldNews .tlt').eq(i).val(),
                inst = $('.oldNews .institution').eq(i).val(),
                type = $('.oldNews .position option:selected').eq(i).attr('value'),
                id = $('.oldNews .record').eq(i).attr('getId');
            let arr = {
                'spread': hot,
                'title': tlt,
                'inst': inst,
                'type': type,
                'timeId': form.userDateId,
                'id': id
            };
            oldNewsJson.push(arr);
        });
        /*=================*/
        $('.commentsBox').children('.record').each((i, e) => {
            let name = $('.commentsBox .nickname').eq(i).val(),
                review = $('.commentsBox .review').eq(i).val(),
                id = $('.commentsBox .record').eq(i).attr('getId');

            let arr = {
                'nickName': name,
                'take': review,
                'timeId': form.userDateId,
                'id': id
            };
            commentsBoxJson.push(arr);
        });

        /*================*/
        $('.manuscriptBox').children('.record').each((i, e) => {
            let num = $('.manuscriptBox .quantity').eq(i).val(),
                inst = $('.manuscriptBox .institution').eq(i).val(),
                type = $('.manuscriptBox .position option:selected').eq(i).attr('value'),
                id = $('.manuscriptBox .record').eq(i).attr('getId');


            let arr = {
                'quantity': num,
                'inst': inst,
                'type': type,
                'timeId': form.userDateId,
                'id': id
            };
            manuscriptBoxJson.push(arr);
        });
        /*==============*/
        $('.informationBox').children('.record').each((i, e) => {
            let percent = $('.informationBox .percent').eq(i).val(),
                inst = $('.informationBox .institution').eq(i).val(),
                id = $('.informationBox .record').eq(i).attr('getId');

            let arr = {
                'count': percent,
                'inst': inst,
                'timeId': form.userDateId,
                'id': id
            };
            informationBoxJson.push(arr);
        });
        /*==============*/
        $('.cityNewsBox').children('.record').each((i, e) => {
            let cId = $('.cityNewsBox .allCity option:selected').eq(i).attr('cId'),
                title = $('.cityNewsBox .tlt').eq(i).val(), inst = $('.cityNewsBox .institution').eq(i).val(),
                type = $('.cityNewsBox .position option:selected').eq(i).attr('value'),
                id = $('.cityNewsBox .record').eq(i).attr('getId');

            let arr = {
                'cId': cId,
                'title': title,
                'inst': inst,
                'type': type,
                'timeId': form.userDateId,
                'id': id
            };
            cityNewsBoxJson.push(arr);

        });
        upAllData()

    });

    /*上传所有数据结束*/

    /*添加删除数据*/
    $('.informationBox .add').click(function () {
        let that = $(this);
        let parent = that.parent().parent().attr('class');
        if (form.userDateId == '') {
            alert('请选择日期');
            return
        }else if ($('.informationBox .record').length >= 5) {
            alert('信息量占比不能超过5组数据');
            return
        }
        let informationBoxHtml = '';
        /*
         * <div class="record">
         <input class="quantity" type="number" min="0" placeholder="稿件数量">
         <input class="institution" type="text" placeholder="机构">
         </div>*/
        informationBoxHtml += '<div getId="0" class="record">';
        informationBoxHtml += '<span class="del"></span>';
        informationBoxHtml += '<input onkeypress="return event.keyCode>=48&&event.keyCode<=57" class="percent" type="number" min="0" placeholder="百分比">';
        informationBoxHtml += '<input class="institution" type="text" placeholder="机构">';
        informationBoxHtml += '</div>';
        if (parent == 'informationBox') {
            $('.' + parent).append(informationBoxHtml);
            $('.informationBox .del').unbind('click').click(function () {
                let that = $(this);
                // console.log(that.parent().attr('id'));
                sendAjax(
                    form.url + 'delRatio.do',
                    {
                        'id': that.parent().attr('getId')
                    },
                    'json',
                    () => {
                        that.parent().remove();
                        // getDefaultAjax()
                    }
                )
            })
        }
    });
    $('.newsBox .add,.oldNews .add,.commentsBox .add,.manuscriptBox .add,.cityNewsBox .add').click(function () {
        let that = $(this);

        let newsBoxHtml = '';
        /*
         * <input class="hot" type="number" max="100" min="0" placeholder="热度">
         <input class="tlt" type="text" placeholder="标题">
         <input class="institution" type="text" placeholder="机构">
         <select>
         <option value="内部">内部</option>
         <option value="外部">外部</option>
         </select>*/
        newsBoxHtml += '<div getId="0" class="record">';
        newsBoxHtml += '<span class="del"></span>';
        newsBoxHtml += '<input onkeypress="return event.keyCode>=48&&event.keyCode<=57" class="hot num" type="number" min="0" placeholder="热度">';
        newsBoxHtml += '<input class="tlt" type="text" placeholder="标题">';
        newsBoxHtml += '<input class="institution" type="text" placeholder="机构">';
        newsBoxHtml += '<select class="position">';
        newsBoxHtml += '<option value="0">内部</option>';
        newsBoxHtml += '</select>';
        newsBoxHtml += '</div>';

        let oldNewsHtml = '';
        oldNewsHtml += '<div getId="0" class="record">';
        oldNewsHtml += '<span class="del"></span>';
        oldNewsHtml += '<input onkeypress="return event.keyCode>=48&&event.keyCode<=57" class="hot num" type="number" min="0" placeholder="热度">';
        oldNewsHtml += '<input class="tlt" type="text" placeholder="标题">';
        oldNewsHtml += '<input class="institution" type="text" placeholder="机构">';
        oldNewsHtml += '<select class="position">';
        oldNewsHtml += '<option value="0">内部</option>';
        oldNewsHtml += '</select>';
        oldNewsHtml += '</div>';

        let commentsBoxHtml = '';
        /*
         *<div class="record">
         <input class="nickname" type="text" placeholder="昵称">
         <input class="review" type="text" placeholder="评论">
         </div>
         */
        commentsBoxHtml += '<div getId="0" class="record">';
        commentsBoxHtml += '<span class="del"></span>';
        commentsBoxHtml += '<input class="nickname" type="text" placeholder="昵称">';
        commentsBoxHtml += '<input class="review" type="text" placeholder="评论">';
        commentsBoxHtml += '</div>';

        let manuscriptBoxHtml = '';
        /*
         * <div class="record">
         <input class="quantity" type="number" min="0" placeholder="稿件数量">
         <input class="institution" type="text" placeholder="机构">
         <select>
         <option value="内部">内部</option>
         <option value="外部">外部</option>
         </select>
         </div>*/
        manuscriptBoxHtml += '<div getId="0" class="record">';
        manuscriptBoxHtml += '<span class="del"></span>';
        manuscriptBoxHtml += '<input onkeypress="return event.keyCode>=48&&event.keyCode<=57" class="quantity" type="number" min="0" placeholder="稿件数量">';
        manuscriptBoxHtml += '<input class="institution" type="text" placeholder="机构">';
        manuscriptBoxHtml += '<select class="position">';
        manuscriptBoxHtml += '<option value="0">内部</option>';
        manuscriptBoxHtml += '<option value="1">外部</option>';
        manuscriptBoxHtml += '</select>';
        manuscriptBoxHtml += '</div>';



        let cityNewsBoxHtml = '';
        /*
         * <div class="record">
         <select class="allCity">
         <option value="">北京市</option>
         </select>
         <input class="tlt" type="text" placeholder="标题">
         <input class="institution" type="text" placeholder="机构">
         <select>
         <option value="内部">内部</option>
         <option value="外部">外部</option>
         </select>
         </div>*/
        cityNewsBoxHtml += '<div getId="0" class="record">';
        cityNewsBoxHtml += '<span class="del"></span>';
        cityNewsBoxHtml += '<select class="allCity">';
        cityNewsBoxHtml += '</select>';
        cityNewsBoxHtml += '<input class="tlt" type="text" placeholder="标题">';
        cityNewsBoxHtml += '<input class="institution" type="text" placeholder="机构">';
        cityNewsBoxHtml += '<select class="position">';
        cityNewsBoxHtml += '<option value="0">内部</option>';
        cityNewsBoxHtml += '<option value="1">外部</option>';
        cityNewsBoxHtml += '</select>';
        cityNewsBoxHtml += '</div>';


        let parent = that.parent().parent().attr('class');
        if (parent == 'newsBox') {
            $('.' + parent).append(newsBoxHtml);

            $('.newsBox .del').unbind('click').click(function () {
                let that = $(this);
                sendAjax(
                    form.url + 'delNews.do',
                    {
                        'id': that.parent().attr('getId')
                    },
                    'json',
                    () => {
                        that.parent().remove();
                        // getDefaultAjax()
                    }
                )
            });
        } else if (parent == 'oldNews') {
            $('.' + parent).append(oldNewsHtml);

            $('.oldNews .del').unbind('click').click(function () {
                let that = $(this);
                sendAjax(
                    form.url + 'delHNews.do',
                    {
                        'id': that.parent().attr('getId')
                    },
                    'json',
                    () => {
                        that.parent().remove();
                        // getDefaultAjax()
                    }
                )
            });
        } else if (parent == 'commentsBox') {
            $('.' + parent).append(commentsBoxHtml);
            $('.commentsBox .del').unbind('click').click(function () {
                let that = $(this);
                sendAjax(
                    form.url + 'delTake.do',
                    {
                        'id': that.parent().attr('getId')
                    },
                    'json',
                    () => {
                        that.parent().remove();
                        // getDefaultAjax()
                    }
                )
            })
        } else if (parent == 'manuscriptBox') {
            $('.' + parent).append(manuscriptBoxHtml);
            $('.manuscriptBox .del').unbind('click').click(function () {
                let that = $(this);
                // console.log(that.parent().attr('id'));
                sendAjax(
                    form.url + 'delManu.do',
                    {
                        'id': that.parent().attr('getId')
                    },
                    'json',
                    () => {
                        that.parent().remove();
                        // getDefaultAjax()
                    }
                )
            })
        } else if (parent == 'cityNewsBox') {
            $('.' + parent).append(cityNewsBoxHtml);
            pushCity();
            $('.cityNewsBox .del').unbind('click').click(function () {
                let that = $(this);
                sendAjax(
                    form.url + 'delMap.do',
                    {
                        'id': that.parent().attr('getId')
                    },
                    'json',
                    () => {
                        that.parent().remove();
                        // getDefaultAjax()
                    }
                )

            })
        }
    });
    /*添加删除数据结束*/
});


function getAllDateAjax() {
    sendAjax(form.url + 'seedTime.do', '', 'json', function (res) {
        let allDate = res.data;
        $.each(allDate, function (i, e) {
            let date = $('<tr><td id="' + e.id + '" class="userDate">' + e.timest + '</td>></tr>>');
            $('#allDate').append(date);
        });
        $('.userDate').click(function () {
            let that = $(this);
            that.addClass('act').parent().siblings().children().removeClass('act');
            form.userDateId = that.attr('id');
            form.userDate = that.text();

            getDefaultAjax();

        });

    })
}
function getCityAjax() {
    sendAjax(
        form.url + 'getCity.do',
        {
            'type': '1'
        },
        'json',
        function (res) {
            cityList = res.data;
        })
}
function pushCity() {
    $.each(cityList, function (i, e) {
        let city = $('<option cId="' + e.id + '">' + e.city + '</option>>');
        $('.allCity').append(city);
    });
}

/*=============获取默认数据==============*/
function getDefaultAjax() {
    //5条数据
    sendAjax(
        form.url + 'seedNumber.do',
        {
            'timeId': form.userDateId
        },
        'json',
        (res) => {
            let data = res.data;

            if (data != '') {
                $('.dispatch').val(data[0].manuscripts);
                $('.dispatch').attr('getId', data[0].id);
                $('.reprint').val(data[0].reprint);
                $('.read').val(data[0].institution);
                $('.remark').val(data[0].comment);
                $('.good').val(data[0].agree);
            } else {
                $('.dispatch').val('');
                $('.reprint').val('');
                $('.read').val('');
                $('.remark').val('');
                $('.good').val('');
                $('.dispatch').attr('getId', '0');
            }
        }
    );
    //热门新闻
    sendAjax(
        form.url + 'seedNews.do',
        {
            'timeId': form.userDateId
        },
        'json',
        (res) => {
            $('.newsBox .record').remove();
            let data = res.data;
            if (data != '') {
                $.each(data, (i, e) => {
                    let newsBoxHtml = '';
                    newsBoxHtml += '<div getId="' + e.id + '" class="record">';
                    newsBoxHtml += '<span class="del"></span>';
                    newsBoxHtml += '<input onkeypress="return event.keyCode>=48&&event.keyCode<=57" class="hot num" type="number" min="0" placeholder="热度" value="' + e.spread + '">';
                    newsBoxHtml += '<input class="tlt" type="text" placeholder="标题" value="' + e.title + '">';
                    newsBoxHtml += '<input class="institution" type="text" placeholder="机构" value="' + e.institution + '">';
                    newsBoxHtml += '<select class="position">';
                    newsBoxHtml += '<option value="0">内部</option>';
                    newsBoxHtml += '</select>';
                    newsBoxHtml += '</div>';
                    $('.newsBox').append(newsBoxHtml);

                });
                $('.newsBox .del').unbind('click').click(function () {
                    let that = $(this);
                    // console.log(that.parent().attr('id'));
                    sendAjax(
                        form.url + 'delNews.do',
                        {
                            'id': that.parent().attr('getId')
                        },
                        'json',
                        () => {
                            that.parent().remove();
                        }
                    )
                });
            }
        }
    );
    //历史新闻
    sendAjax(
        form.url+'seedHNews.do',
        {
            'timeId': form.userDateId
        },
        'json',
        (res)=>{
            $('.oldNews .record').remove();
            let data = res.data;
            if(data!=''){
                $.each(data,(i,e)=>{
                    let oldNewsHtml = '';
                    oldNewsHtml += '<div getId="' + e.id + '" class="record">';
                    oldNewsHtml += '<span class="del"></span>';
                    oldNewsHtml += '<input onkeypress="return event.keyCode>=48&&event.keyCode<=57" class="hot num" type="number" min="0" placeholder="热度" value="' + e.spread + '">';
                    oldNewsHtml += '<input class="tlt" type="text" placeholder="标题" value="' + e.title + '">';
                    oldNewsHtml += '<input class="institution" type="text" placeholder="机构" value="' + e.institution + '">';
                    oldNewsHtml += '<select class="position">';
                    oldNewsHtml += '<option value="0">内部</option>';
                    oldNewsHtml += '</select>';
                    oldNewsHtml += '</div>';
                    $('.oldNews').append(oldNewsHtml);

                });
                $('.oldNews .del').unbind('click').click(function () {
                    let that = $(this);
                    sendAjax(
                        form.url + 'delHNews.do',
                        {
                            'id': that.parent().attr('getId')
                        },
                        'json',
                        () => {
                            that.parent().remove();
                        }
                    )
                });
            }
        }
    );

    //网民评论
    sendAjax(
        form.url + 'seedTake.do',
        {
            'timeId': form.userDateId
        },
        'json',
        (res) => {
            $('.commentsBox .record').remove();

            let data = res.data;
            if (data != '') {
                $.each(data, (i, e) => {
                    let commentsBoxHtml = '';

                    commentsBoxHtml += '<div getId="' + e.id + '" class="record">';
                    commentsBoxHtml += '<span class="del"></span>';
                    commentsBoxHtml += '<input class="nickname" type="text" placeholder="昵称" value="' + e.nickName + '">';
                    commentsBoxHtml += '<input class="review" type="text" placeholder="评论" value="' + e.take + '">';
                    commentsBoxHtml += '</div>';
                    $('.commentsBox').append(commentsBoxHtml);

                });
                $('.commentsBox .del').unbind('click').click(function () {
                    let that = $(this);
                    sendAjax(
                        form.url + 'delTake.do',
                        {
                            'id': that.parent().attr('getId')
                        },
                        'json',
                        () => {
                            that.parent().remove();
                            // getDefaultAjax()
                        }
                    )
                })
            }

        }
    );
    //稿件数量
    sendAjax(
        form.url + 'seedManu.do',
        {
            'timeId': form.userDateId
        },
        'json',
        (res) => {
            $('.manuscriptBox .record').remove();
            let data = res.data;
            if (data != '') {
                $.each(data, (i, e) => {
                    let manuscriptBoxHtml = '';

                    manuscriptBoxHtml += '<div getId="' + e.id + '" class="record">';
                    manuscriptBoxHtml += '<span class="del"></span>';
                    manuscriptBoxHtml += '<input onkeypress="return event.keyCode>=48&&event.keyCode<=57" class="quantity" type="number" min="0" placeholder="稿件数量" value="' + e.quantity + '">';
                    manuscriptBoxHtml += '<input class="institution" type="text" placeholder="机构" value="' + e.institution + '">';
                    manuscriptBoxHtml += '<select class="position">';
                    manuscriptBoxHtml += '<option value="0">内部</option>';
                    manuscriptBoxHtml += '<option value="1">外部</option>';
                    manuscriptBoxHtml += '</select>';
                    manuscriptBoxHtml += '</div>';
                    $('.manuscriptBox').append(manuscriptBoxHtml);
                    if (e.type == 0) {
                        $('.manuscriptBox .position option[value="0"]').eq(i).attr('selected', 'selected')
                    } else {
                        $('.manuscriptBox .position option[value="1"]').eq(i).attr('selected', 'selected')
                    }
                });
                $('.manuscriptBox .del').unbind('click').click(function () {
                    let that = $(this);
                    // console.log(that.parent().attr('id'));
                    sendAjax(
                        form.url + 'delManu.do',
                        {
                            'id': that.parent().attr('getId')
                        },
                        'json',
                        () => {
                            that.parent().remove();
                            // getDefaultAjax()
                        }
                    )
                })

            }
        }
    );
    //信息量占比
    sendAjax(
        form.url + 'seedRatio.do',
        {
            'timeId': form.userDateId
        },
        'json',
        (res) => {
            $('.informationBox .record').remove();
            let data = res.data;

            if (data != '') {
                $.each(data, (i, e) => {
                    let informationBoxHtml = '';

                    informationBoxHtml += '<div getId="' + e.id + '" class="record">';
                    informationBoxHtml += '<span class="del"></span>';
                    informationBoxHtml += '<input onkeypress="return event.keyCode>=48&&event.keyCode<=57" class="percent" type="number" min="0" placeholder="百分比" value="' + e.count + '">';
                    informationBoxHtml += '<input class="institution" type="text" placeholder="机构" value="' + e.institution + '">';
                    informationBoxHtml += '</div>';
                    $('.informationBox').append(informationBoxHtml)
                });
                $('.informationBox .del').unbind('click').click(function () {
                    let that = $(this);
                    sendAjax(
                        form.url + 'delRatio.do',
                        {
                            'id': that.parent().attr('getId')
                        },
                        'json',
                        () => {
                            that.parent().remove();
                            // getDefaultAjax()
                        }
                    )
                })
            }
        }
    );
    //城市热点
    sendAjax(
        form.url + 'seedMap.do',
        {
            'timeId': form.userDateId
        },
        'json',
        (res) => {
            $('.cityNewsBox .record').remove();

            let data = res.data;

            $.each(data, function (i, e) {
                let cityNewsBoxHtml = '';

                cityNewsBoxHtml += '<div getId="' + e.id + '" class="record">';
                cityNewsBoxHtml += '<span class="del"></span>';
                cityNewsBoxHtml += '<select class="allCity">';
                cityNewsBoxHtml += '</select>';
                cityNewsBoxHtml += '<input class="tlt" type="text" placeholder="标题" value="' + e.title + '">';
                cityNewsBoxHtml += '<input class="institution" type="text" placeholder="机构" value="' + e.institution + '">';
                cityNewsBoxHtml += '<select class="position">';
                cityNewsBoxHtml += '<option value="0">内部</option>';
                cityNewsBoxHtml += '<option value="1">外部</option>';
                cityNewsBoxHtml += '</select>';
                cityNewsBoxHtml += '</div>';
                $('.cityNewsBox').append(cityNewsBoxHtml);
                pushCity();
                if (e.type == 0) {
                    $('.cityNewsBox .position option[value="0"]').eq(i).attr('selected', 'selected')
                } else {
                    $('.cityNewsBox .position option[value="1"]').eq(i).attr('selected', 'selected')
                }
                $('.allCity').eq(i).children('option[cId="' + e.cId + '"]').attr('selected', 'selected');

                $('.cityNewsBox .del').unbind('click').click(function () {
                    let that = $(this);
                    // console.log(that.parent().attr('getId'));
                    sendAjax(
                        form.url + 'delMap.do',
                        {
                            'id': that.parent().attr('getId')
                        },
                        'json',
                        () => {
                            that.parent().remove();
                            // getDefaultAjax()
                        }
                    )

                })
            });
        }
    )
}
function sendAjax(url, param, datat, callback) {
    $.ajax({
        type: "post",
        url: url,
        data: param,
        dataType: datat,
        xhrFields: {withCredentials: true},
        crossDomain: true,
        async: 'true',
        success: callback,
        error: (err) => {
            // ClosetoastLoading();
            // errorTip();
            console.log(err);
        }
    });
}
function upAllData() {
    if (allQuantityJson[0].dispatch == '' || allQuantityJson[0].reprint == '' || allQuantityJson[0].read == '' || allQuantityJson[0].remark == '' || allQuantityJson[0].good == '') {
        alert('发稿数，转载数，阅读数，评论数，点赞数不能为空');
        return
    }
    sendAjax(
        form.url + 'addNumber.do',
        {
            'data': JSON.stringify(allQuantityJson)
        },
        'json',
        function () {
            allQuantityJson = [];
            // getDefaultAjax();
            sendAjax(
                form.url + 'addNews.do',
                {
                    'data': JSON.stringify(newsBoxJson)
                },
                'json',
                () => {
                    newsBoxJson = [];
                    sendAjax(
                        form.url+'addHNews.do',
                        {
                            'data': JSON.stringify(oldNewsJson)
                        },
                        'json',
                        ()=>{
                            oldNewsJson = [];
                            sendAjax(
                                form.url + 'addTake.do',
                                {
                                    'data': JSON.stringify(commentsBoxJson)
                                },
                                'json',
                                () => {
                                    commentsBoxJson = [];
                                    // getDefaultAjax();
                                    sendAjax(
                                        form.url + 'addManu.do',
                                        {
                                            'data': JSON.stringify(manuscriptBoxJson)
                                        },
                                        'json',
                                        () => {
                                            manuscriptBoxJson = [];
                                            // getDefaultAjax();
                                            sendAjax(
                                                form.url + 'addRatio.do',
                                                {
                                                    'data': JSON.stringify(informationBoxJson)
                                                },
                                                'json',
                                                () => {
                                                    informationBoxJson = [];
                                                    // getDefaultAjax();
                                                    sendAjax(
                                                        form.url + 'addMap.do',
                                                        {
                                                            'data': JSON.stringify(cityNewsBoxJson)
                                                        },
                                                        'json',
                                                        function () {
                                                            cityNewsBoxJson = [];
                                                            alert('数据上传完成');

                                                            getDefaultAjax();
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    )
                }
            );
        }
    );
}

$(window).bind('beforeunload', function () {
    return '请确认数据已保存';
});