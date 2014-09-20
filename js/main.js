/**
 ** Author: minghao.yu
 ** Email: minghao.yu@qunar.com
 ** Time: 2014/9/19
 ** Overview: 重构八卦为angular
 */

!function(global) {
    'use strict';
    var app = angular.module('gua', []);
    var url = 'gua.json';

    var gua8 = ['地', '山', '水', '风', '雷', '火', '泽', '天'];

    function get6YaoName(xiang, guaName) {
        var up = parseXiang(xiang.slice(0, 3).join(''));
        var down = parseXiang(xiang.slice(3).join(''));
        var ret = up == down ?
                [guaName, '为', gua8[up]] :
                [gua8[down], gua8[up], guaName];
        return ret.join('');
    }


    function parseXiang(xiang) {
        return parseInt(xiang, 2) || 0;
    }

    // 将gua格式化，用卦象作为下标，加入编号和detail的token
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

            value.gua_6yao_name = get6YaoName(xiang, value['gua_name']);
            // 生成卦象编号
            value.gua_number = index + 1;
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
            var guaDataList = [];

            $scope.guaData = [];

            $scope.guaXiang = setXiang();

            // 进行变卦时重新渲染页面元素
            $scope.changeGua = function(i) {
                $scope.guaXiang[5-i] = $scope.guaXiang[5-i] ^ 1;
                $scope.guaData = guaDataList[parseXiang($scope.guaXiang.join(''))];
                $scope.highLightYao(0);
            };

            $scope.showYao = setXiang();
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
            }

            $http.get(url)
                .success(renderGua)
                .error();
        }
    ]);
}(window);