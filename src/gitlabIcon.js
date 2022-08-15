// ==UserScript==
// @name         gitlab 个人头像
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  gitlab没有头像生成一个新的头像
// @author       YY
// @match        http://10.252.192.3/**
// @match        http://git.b2bcsx.com/**
// @icon         http://git.b2bcsx.com/assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png
// @grant        none
// @updateURL    https://raw.githubusercontent.com/xingxiulaoxian/tampermonkeyPlugin/master/src/gitlabIcon.js
// @downloadURL    https://raw.githubusercontent.com/xingxiulaoxian/tampermonkeyPlugin/master/src/gitlabIcon.js
// ==/UserScript==

(function() {
    'use strict';
    const WIDTH = 50;

    function getColorFromStr(str, index) {
        const num = Math.abs(0xffffff - (Math.pow(str.charCodeAt(), index))).toString(16).substr(0,6).padEnd(6, 0);
        return '#' + num;
    }

    function getGradientByName (ctx, name = '') {
        // 线性渐变
        // const gradient = ctx.createLinearGradient(0,0,WIDTH,0);
        // 径向渐变
        const gradient = ctx.createRadialGradient(WIDTH/2,WIDTH/2,0,0,WIDTH,WIDTH)
        const names = name.split('');
        const namesLen = names.length;
        names.forEach((ele, index) => {
            gradient.addColorStop(index / namesLen, getColorFromStr(ele, index));
        })
        return gradient;
    }

    function createNameImg (name) {
        const canvas = document.createElement('canvas');
        canvas.width = `${WIDTH}`;
        canvas.height = `${WIDTH}`;
        canvas.style.width = `${WIDTH}px`;
        canvas.style.height = `${WIDTH}px`;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = getGradientByName(ctx, name);
        ctx.fillRect(0, 0, WIDTH, WIDTH)
        ctx.font = "14px serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.strokeStyle = '#000';
        ctx.strokeText(name, WIDTH / 2, WIDTH / 2);
        // canvas.toBlob((blob) => {
        //     cb(URL.createObjectURL(blob))
        // }, 'image/jpeg')
        return canvas;
    }

    // 优化缓存函数，避免重复创建canvas标签
    const createNameImgCache = (() => {
        const list = {};
        return (name, cb) => {
            // console.log(list)
            const _name = `__name__${name}`;
            if (!list[_name]) {
                list[_name] = createNameImg(name);
            }
            list[_name].toBlob((blob) => {

                cb(URL.createObjectURL(blob))
            }, 'image/jpeg');
        }
    })()

    // 监听所有错误事件，如果事件源是img就触发创建图标
    window.addEventListener('error', (event) => {
        const target = event.target;
        if (target.tagName.toLocaleUpperCase() !== 'IMG') return false;
        createNameImgCache(target.title || target.alt, url => {
            target.src = url;
            // console.log('捕获到异常：', url, event);
            // return console.log('sdddddd', target.title, target)
        });
    }, true);
})();

