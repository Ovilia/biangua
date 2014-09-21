/**
 ** Author: minghao.yu
 ** Email: minghao.yu@qunar.com
 ** Time: 2014/9/19
 ** Overview: 重构变卦 by angular
 */

!function(global) {
    'use strict';
    var app = angular.module('gua', []);
    var url = 'gua.json';

    var gua8 = ['地', '山', '水', '风', '雷', '火', '泽', '天'];

    /**
     * 根据六爻计算全卦名，格式为上卦+下卦+卦名，如果上下卦相同则为卦名+为+上卦
     * @param xiang {Array} 传入六位数组的卦象
     * @param guaName {string} 数据中存放的卦名
     * @returns {string} 全卦名
     */
    function get6YaoName(xiang, guaName) {
        var up = parseXiang(xiang.slice(0, 3).join(''));
        var down = parseXiang(xiang.slice(3).join(''));
        var ret = up == down ?
                [guaName, '为', gua8[up]] :
                [gua8[down], gua8[up], guaName];
        return ret.join('');
    }

    /**
     * 将六位二进制卦象转为十进制
     * @param xiangStr {string} 六位字符串格式的卦象，如 “111111”
     * @returns {Number|number} 返回十进制结果
     */
    function parseXiang(xiangStr) {
        return parseInt(xiangStr, 2) || 0;
    }

    /**
     * 将gua格式化，用卦象作为下标，加入编号和detail的token
     * token的规则为：1. 从下至上分别为“初”到“上”；2. 阳为“九”，阴为“六”
     * @param data {json} 全部json数据
     * @returns {Array} 返回以二进制卦象作为下标的结果集数组
     */
    function formatData(data) {
        var gua = [];
        angular.forEach(data.gua, function(value, index) {
            var xiang = value['gua_xiang'].split(''),
                ids = ['初', '二', '三', '四', '五', '上'],
                yinYang = ['六', '九'],
                yao = [], getToken = function(i, yi) {
                    var ret = [yinYang[yi], ids[i]];
                    var headAndTail = +(i == 0 || i == 5);
                    return [ret[headAndTail], ret[headAndTail ^ 1], '：'].join('');
                };

            // 直接在结果集中加入六爻卦名
            value.gua_6yao_name = get6YaoName(xiang, value['gua_name']);
            // 生成卦象编号
            value.gua_number = index + 1;
            // 直接在结果集中加入token
            angular.forEach(value['yao_detail'], function(v, i) {
                yao.unshift({
                    num: xiang[i],
                    detail: getToken(i, xiang[i]) + v
                })
            });
            value['yao'] = yao;
            gua[parseXiang(value['gua_xiang'])] = value;
        });
        return gua;
    }

    /**
     * 根据一个数字生成六位相同数字的数组的卦象，用于快速初始化
     * @param xiang
     * @returns {Array}
     */
    function setXiang(xiang) {
        var xiangArr = [];
        for (var i = 0; i < 6; i++) {
            xiangArr.push(+xiang || 0);
        }
        return xiangArr;
    }

    app.controller('guaMainCtrl', [
        '$scope',
        '$http',
        function($scope, $http) {
            // 存放结果集
            var guaDataList = [];

            $scope.guaData = [];
            $scope.social = {};
            $scope.guaXiang = setXiang(1);

            // 进行变卦时重新渲染页面元素
            $scope.changeGua = function(i) {
                $scope.guaXiang[5-i] = $scope.guaXiang[5-i] ^ 1;
                $scope.guaData = guaDataList[parseXiang($scope.guaXiang.join(''))];
                $scope.highLightYao(0);
            };

            // 控制显示detail
            $scope.showYao = setXiang();
            // 控制爻的高亮
            $scope.hideYao = setXiang();

            $scope.highLightYao = function(index, highLight) {
                var hide = highLight ? setXiang(1) : setXiang();
                $scope.showYao[index] = highLight;
                $scope.hideYao = hide;
                $scope.hideYao[index] = false;
            };

            function renderGua(data) {
                guaDataList = formatData(data);
                $scope.guaData = guaDataList[63];
                $scope.social = data['social'];
            }

            $http.get(url)
                .success(renderGua)
                .error(function() {
                    alert('数据获取失败，请刷新重试！');
                });
        }
    ]);
}(window);