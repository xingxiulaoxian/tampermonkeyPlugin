// ==UserScript==
// @name         gitlab 个人头像
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://10.252.192.3/**
// @match        http://git.b2bcsx.com/**
// @icon         https://www.google.com/s2/favicons?domain=192.3
// @grant        none
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

    function createNameImg (name, cb) {
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
        canvas.toBlob((blob) => {
            cb(URL.createObjectURL(blob))
        }, 'image/jpeg')
    }

//  会把所有的图标都改成canvas图标
//     setTimeout(() => {
//          const [...list] = document.querySelectorAll('.avatar')
//         console.dir(list)
//         list.forEach(target => {
//             createNameImg(target.title || target.alt, url => {
//                 target.src = url;
//                 console.log('捕获到异常：', url, event);
//                 // return console.log('sdddddd', target.title, target)
//             });
//         })
//     }, 100)


    window.addEventListener('error', (event) => {
        const target = event.target;
        if (target.tagName.toLocaleUpperCase() !== 'IMG') return false;
        createNameImg(target.title || target.alt, url => {
            target.src = url;
            console.log('捕获到异常：', url, event);
            // return console.log('sdddddd', target.title, target)
        });
    }, true);

    // Your code here...
})();

