define(
    ["angular", "devConfig", "pathConfig", "jquery"],
    function (ng, config, path, $) {
        "use strict";
        ng.module("webcam-module", []).controller("webcam-ctrl",
            ['$scope', '$location', '$$console', '$timeout', '$interval', '$$ls', '$q', '$http',
                function ($scope, $location, $$console, $timeout, $interval, $$ls, $q, $http) {

                    var ff = $scope._f;
                    var s = $scope.s = {
                        supportFile: false
                    };

                    if (window.File && window.FileReader && window.FileList && window.Blob) {
                        s.supportFile = true;
                    } else {
                        console.log('The File APIs are not fully supported in this browser.');
                        return;
                    }

                    /**
                     * 文件选择：使用表单输入进行选择
                     */
                    //demo1:传多个文件
                    var f1 = document.getElementById("file1"),
                        f2 = document.getElementById("file2"),
                        f3 = document.getElementById("file3"),
                        f4 = document.getElementById("file4"),
                        o1 = document.getElementById("output1"),
                        o2 = document.getElementById("output2"),
                        o3 = document.getElementById("output3");

                    f1.addEventListener("change", handleFileSelect, false);
                    function handleFileSelect(evt) {
                        var files = evt.target.files, output = [];
                        for (var i = 0, f; f = files[i], i < files.length; i++) {
                            output.push(
                                "<li><strong>",
                                escape(f.name),
                                "</strong>",
                                "(", f.type || "n/a", ") - ",
                                f.size, "bytes,",
                                "last modified:" + f.lastModifiedDate.toLocaleDateString(),
                                "</li>"
                            );
                            o1.innerHTML = "<ul>" + output.join("") + "</ul>";
                        }
                    }

                    /**
                     * 文件选择：使用拖放操作进行选择
                     */
                    var dropZone = document.getElementById("drop-zone");
                    dropZone.addEventListener("dragover", handleDropOver, false);
                    dropZone.addEventListener("drop", handleDropFileSelect, false);
                    function handleDropOver(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();
                        evt.dataTransfer.dropEffect = "copy";
                    }

                    function handleDropFileSelect(evt) {
                        evt.stopPropagation();
                        evt.preventDefault();
                        var files = evt.dataTransfer.files, output = [];
                        for (var i = 0, f; f = files[i], i < files.length; i++) {
                            output.push(
                                "<li><strong>",
                                escape(f.name),
                                "</strong>",
                                "(", f.type || "n/a", ") - ",
                                f.size, "bytes,",
                                "last modified:" + f.lastModifiedDate.toLocaleDateString(),
                                "</li>"
                            );
                            o2.innerHTML = "<ul>" + output.join("") + "</ul>";
                        }
                    }

                    /**
                     * 文件提取：展示缩略图
                     */
                    f2.addEventListener("change", handleThumbFileSelect, false);
                    function handleThumbFileSelect(evt) {
                        var files = evt.target.files;
                        for (var i = 0, f; f = files[i], i < files.length; i++) {
                            if (!f.type.match("image.*")) {
                                continue;
                            }
                            // Closure to capture the file information.
                            var reader = new FileReader();
                            reader.onload = (function (theFile) {
                                return function (e) {
                                    var span = document.createElement("span");
                                    span.innerHTML = [
                                        "<img src=",
                                        e.target.result,
                                        "class='thumb'",
                                        "title=",
                                        escape(theFile.name),
                                        ">"
                                    ].join(" ");
                                    o3.insertBefore(span, null);
                                };
                            })(f);
                            reader.readAsDataURL(f);
                        }
                    }

                    /**
                     * 分割文件
                     * 异步文件上传器：要提高上传速度，一种可行的方法是以彼此独立的字节范围块读取和发送文件。然后，由服务器组件负责按正确顺序重建文件。
                     */
                    document.querySelector(".readBytesButton")
                        .addEventListener("click", function (evt) {
                            var tar = evt.target;
                            if (tar.tagName.toLowerCase() === "button") {
                                var startByte = tar.getAttribute("data-startbyte");
                                var endByte = tar.getAttribute("data-endbyte");
                                readBlob(startByte, endByte);
                            }
                        }, false);
                    function readBlob(opt_startByte, opt_endByte) {
                        var files = f3.files;
                        if (files.length < 1) {
                            console.log("请选择一个文件");
                            return;
                        }
                        var f = files[0];
                        var start = parseInt(opt_startByte) || 0;
                        var end = parseInt(opt_endByte) || f.size - 1;
                        var reader = new FileReader();
                        //使用onloadend，必须校验readyState
                        reader.onloadend = function (evt) {
                            var tar = evt.target;
                            if (tar.readyState == FileReader.DONE) {
                                document.getElementById("byte-range").textContent = tar.result;
                                document.getElementById("byte-content").textContent =
                                    ["read bytes ", start + 1, " to ", end + 1, " in ", f.size, " bytes file"].join("");
                            }
                        };
                        var sliceFunc = f.slice ? f.slice : f.webkitSlice ? f.webkitSlice : f.mozSlice;
                        var blob = sliceFunc.apply(f, [start, end + 1]);
                        reader.readAsBinaryString(blob);
                    }

                    /**
                     * 监控读取进度
                     */
                    var reader;
                    var progress = document.querySelector("#percent");
                    f4.addEventListener("change", handleProgressFileSelect, false);
                    $scope.cancelRead = function cancelRead() {
                        reader.abort();
                    };
                    function handleProgressFileSelect(evt) {
                        //当新文件被加载时，重置progress indicator
                        progress.style.width = "0%";
                        progress.textContent = "0%";
                        reader = new FileReader();
                        reader.onerror = errorHandler;
                        reader.onprogress = updateHandler;
                        reader.onerror = function (e) {
                            console.log("文件读取被取消");
                        };
                        reader.onloadstart = function (e) {
                            document.getElementById("progress-bar").className = "loading";
                        };
                        reader.onload = function (e) {
                            //保证progress最后展示100%
                            progress.style.width = "100%";
                            progress.textContent = "100%";
                            $timeout(function () {
                                document.getElementById('progress-bar').className = '';
                            }, 2000);
                        };
                        reader.readAsBinaryString(evt.target.files[0]);
                    }

                    function errorHandler(evt) {
                        switch (evt.target.error.code) {
                            case evt.target.error.NOT_FOUND_ERR:
                                console.log("找不到该文件");
                                break;
                            case evt.target.error.NOT_READABLE_ERR:
                                console.log("文件不可读");
                                break;
                            case evt.target.error.ABORT_ERR:
                                console.log("文件读取被中断");
                                break;
                            default :
                                console.log("读取文件发生异常");
                        }
                    }

                    function updateHandler(evt) {
                        //evt is a progress event
                        if (evt.lengthComputable) {
                            var percentLoaded = Math.round(evt.loaded / evt.total * 100);
                            //increase the progress bar length
                            if (percentLoaded < 100) {
                                progress.style.width = percentLoaded + "%";
                                progress.textContent = percentLoaded + "%";
                            }
                        }
                    }

                    /**
                     * 网络摄像头demo
                     * */
                    // Put event listeners into place
                    // Grab elements, create settings, etc.
                    var canvas = document.getElementById("canvas"),
                        context = canvas.getContext("2d"),
                        video = document.getElementById("video"),
                        videoObj = { "video": true },
                        img = document.getElementById("img"),
                        errBack = function (error) {
                            console.log("Video capture error: ", error.code);
                        };

                    // Put video listeners into place
                    if (navigator.getUserMedia) { // Standard
                        navigator.getUserMedia(videoObj, function (stream) {
                            video.src = stream;
                            video.play();
                        }, errBack);
                    } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
                        navigator.webkitGetUserMedia(videoObj, function (stream) {
                            video.src = window.webkitURL.createObjectURL(stream);
                            video.play();
                        }, errBack);
                    }
                    else if (navigator.mozGetUserMedia) { // Firefox-prefixed
                        navigator.mozGetUserMedia(videoObj, function (stream) {
                            video.src = window.URL.createObjectURL(stream);
                            video.play();
                        }, errBack);
                    }
                    // Trigger photo take
                    document.getElementById("snap").addEventListener("click", function () {
                        context.drawImage(video, 0, 0, 640, 480);
                        img.src = canvas.toDataURL("image/jpeg");
                    });

                    $scope.$on('$destroy', function () {
                        $interval.cancel();
                    });
                }]);

    }
);






