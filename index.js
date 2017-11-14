/**
 * Created by zhanglongyu on 2017/11/14.
 */

/*
* 使用说明
*   $('.file').on('change', function () {
         var fileData = this.files[0];
         var resize = new Compress();
         resize.fileResizeDataURL(fileData,function (dataURL,size) {
            $('img')[0].src = dataURL;
         });
     });
* */

"use strict"

window.Compress = (function () {
    var resize = function () {
    };
    resize.prototype.fileToDataURL = function(file, fn) {
        var reader = new FileReader();
        reader.onloadend = function (e) {
            fn(e.target.result);
        }
        reader.readAsDataURL(file);
    }
    resize.prototype.dataURLToImg = function(dataURL, fn) {
        var img = new Image();
        img.onload = function () {
            fn(img);
        }
        img.src = dataURL;
    }
    resize.prototype.urlToImg = function(url,fn) {
        var img = new Image();
        img.onload = function () {
            fn(img)
        }
        img.src = url;
    }
    resize.prototype.imgToCanvas = function(img) {
        var cvs = document.createElement('canvas');
        var ctx = cvs.getContext('2d');
        cvs.width = img.width;
        cvs.height = img.height;
        ctx.drawImage(img,0,0,cvs.width,cvs.height);
        return cvs;
    }
    resize.prototype.canvasResizeFile = function(canvas, quality, fn) {
        canvas.toBlob(function (blob) {
            fn(blob)
        },'image/jpeg',quality);
    }
    resize.prototype.canvasResizeDataURL = function(canvas, quality) {
        return canvas.toDataURL('image/jpeg',quality);
    }
    resize.prototype.dataURLToFile = function(dataURL) {
        var arr = dataURL.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var bstr = atob(arr[1]);
        var n = bstr.length;
        var uarr = new Uint8Array(n);
        while (n--) {
            uarr[n] = bstr.charCodeAt(n)
        }
        return new Blob([uarr],{type:mime})
    }
    resize.prototype.fileResizeDataURL = function (file,fn) {  //图片文件压缩为base64
        var _this = this;
        _this.fileToDataURL(file,function (dataURL) {
            _this.dataURLToImg(dataURL,function (img) {
                var base64 = _this.canvasResizeDataURL(_this.imgToCanvas(img),0.5);
                fn(base64,_this.dataURLToFile(base64).size)
            })
        })
    }
    resize.prototype.fileResizeFile = function (file,fn) {  //图片文件压缩为图片文件
        var _this = this;
        _this.fileToDataURL(file,function (dataURL) {
            _this.dataURLToImg(dataURL,function (img) {
               _this.canvasResizeFile(_this.imgToCanvas(img),0.5,function (blob) {
                    fn(blob)
                });
            })
        })
    }
    return resize;
})();
