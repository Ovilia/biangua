var gb = {
    gua: null,
    selectedGua: null
};

function loadGua(guaXiang) {
    if (gb.gua !== null) {
        var len = gb.gua.length;
        for (var i = 0; i < len; ++i) {
            if (gb.gua[i]['gua-xiang'] === guaXiang) {
                gb.selectedGua = gb.gua[i];
                
                // update yao
                for (var y = 1; y <= 6; ++y) {
                    var yao = $('#yao' + y + ' .yinyang');
                    if (yao.hasClass('yin') && guaXiang[y - 1] === '1') {
                        yao.removeClass('yin', 1000).addClass('yang');
                    } else if (yao.hasClass('yang') && guaXiang[y - 1] === '0') {
                        yao.addClass('yin', 1000).removeClass('yang');
                    }
                }
                
                var name = gb.gua[i]['gua-name'];
                $('#back-title').text(name);
                $('#gua-number').text(i + 1);
                $('#gua-name').text(getGuaName(guaXiang, name));
                $('#gua-detail').text(gb.gua[i]['gua-detail']);
                return true;
            }
        }
    }
    console.error('no gua:', guaXiang);
    _gaq.push(['_trackEvent', 'BianGua', 'No Gua', guaXiang]);
    return false;
}

function getGuaName(guaXiang, guaName) {
    var name = ['地', '雷', '水', '泽', '山', '火', '风', '天'];
    var last = parseInt(guaXiang[0]) + parseInt(guaXiang[1]) * 2
            + parseInt(guaXiang[2]) * 4;
    var first = parseInt(guaXiang[3]) + parseInt(guaXiang[4]) * 2
            + parseInt(guaXiang[5]) * 4;
    if (first === last) {
        return guaName + '为' + name[first];
    } else {
        return name[first] + name[last] + guaName;
    }
}

$(document).ready(function () {
    $('.yao').hover(function() {
        if (gb.selectedGua === null) {
            return;
        }
        $('.yao, #back-title').addClass('unhover');
        $(this).removeClass('unhover');
        
        var id = 5 - $(this).index();
        var idStrList = ['初', '二', '三', '四', '五', '上'];
        var yinYang = gb.selectedGua['gua-xiang'][id] === '1' ? '九' : '六';
        if (id === 0 || id === 5) {
            var yaoDetail = idStrList[id] + yinYang;
        } else {
            var yaoDetail = yinYang + idStrList[id];
        }
        yaoDetail += '：' + gb.selectedGua['yao-detail'][id];
        $('#yao-detail').css('top', $(this).offset().top).text(yaoDetail)
                .show();
    }, function() {
        $('.yao, #back-title').removeClass('unhover');
        $('#yao-detail').hide();
        
    }).click(function() {
        if (gb.selectedGua === null) {
            return;
        }
        var id = 5 - $(this).index();
        var guaXiang = gb.selectedGua['gua-xiang'];
        var changeBit = guaXiang[id];
        changeBit = changeBit === '1' ? '0' : '1';
        guaXiang = guaXiang.substr(0, id) + changeBit + guaXiang.substr(id + 1);
        loadGua(guaXiang);
        
        location.hash = guaXiang;
        $('.yao, #back-title').removeClass('unhover');
        $('#yao-detail').hide();
    });
    
    $.ajax({
        url: 'gua.json',
        dataType: 'json',
        success: function(data) {
            gb.gua = data.gua;
            var hash = location.hash.replace('#', '');
            if (hash === '') {
                loadGua('111111');
            } else {
                if (!loadGua(hash)) {
                    location.hash = '';
                    loadGua('111111');
                }
            }
        },
        error: function(e) {
            alert('数据获取失败，请刷新重试！');
            _gaq.push(['_trackEvent', 'BianGua', 'No JSON', e.toString()]);
        }
    });
});
