resizeImage = function(image, width, height){
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 85);
};

var ImageUpload = Vue.extend({
    template:   '<div class="image-upload">'
                    +'<div class="image-preview">'
                        +'<img v-bind:src="image" alt="食品圖片" v-if="image" v-on:click="chooseFile()">'
                        +'<div class="image-comment" v-if="!image" v-on:click="chooseFile()">'
                            +'<label>圖片大小 240 x 240</label>'
                        +'</div>'
                    +'</div>'
                    +'<div class="image-button">'
                        +'<button type="button" class="btn btn-default" v-on:click="chooseFile()">上傳圖片</button>'
                    +'</div>'
                +'</div>',
    data: function () {
        return {
            image : '',
            newImage: '',
            input : undefined
        };
    },
    props: ['image'],
    methods: {
        chooseFile: function() {
            var that = this;
            if (!this.input) {
                input = document.createElement("input");
                input.setAttribute("type", "file");
                input.onchange = function () {
                    var file = input.files[0];
                    if (file.type.match(input.accept)) {
                        var reader = new FileReader();
                        reader.onload = function(e) {
                            var img = new Image();
                            img.onload = function() {
                                that.image = resizeImage(img, 240, 240);
                                that.newImage = that.image;
                            };
                            img.src = reader.result;
                        }
                        reader.readAsDataURL(file);
                    }
                };
            }
            input.click();
        },
        value: function() {
            return this.newImage;
        }
    }
});
Vue.component('image-upload', ImageUpload)

//vue component
var HyperlinkGroup = Vue.extend({
    template:  '<div class="hyperlink-group">'
                    +'<ul>'
                        +'<template v-for="data in hyperlinks">'
                            +'<li class="hyperlink-item" transition="expand">'
                                +'<label class="control-label">URL：</label>'
                                +'<button type="button" class="btn" v-on:click="remove(data)" title="移除">'
                                    +'<span class="glyphicon glyphicon-remove"></span>'
                                +'</button>'
                                +'<input type="text" class="form-control" placeholder="例如：https://tw.yahoo.com" v-model="data.url" value="{{data.url}}"><br>'
                                +'<label class="control-label">標題：</label>'
                                +'<input type="text" class="form-control" placeholder="例如：yahoo 新聞" v-model="data.title" value="{{data.title}}"><br>'
                                +'<label class="control-label">簡述：</label>'
                                +'<textarea class="form-control" rows="3" placeholder="例如：xxx 廠商黑心原料" v-model="data.brief">{{data.brief}}</textarea>'
                            +'</li>'
                        +'</template>'
                    +'</ul>'
                    +'<div class="input-group">'
                        +'<input type="url" class="form-control" placeholder="例如：https://tw.yahoo.com" v-model="newlink" v-on:keydown.enter="insert()" v-bind:disabled="process">'
                        +'<span class="input-group-btn">'
                            +'<button type="button" class="btn btn-default" v-on:click="insert()" title="新增" v-bind:disabled="process">'
                                +'<span class="glyphicon glyphicon-plus"></span>'
                            +'</button>'
                        +'</span>'
                    +'</div>'
                +'</div>',
    data: function () {
        return {
            process: false,
            hyperlinks:[]
        };
    },
    props: ['hyperlinks'],
    methods: {
        insert: function() {
            if (this.newlink) {
                this.process = true;
                this.$http.get("/api/crawler?url=" + this.newlink, function (data, status, request) {
                    this.hyperlinks.push(data.result);
                    this.newlink = "";
                    this.process = false;
                }).error(function (data, status, request) {
                    console.log(data);
                    this.process = false;
                });
            }
        },
        remove: function(data) {
            this.hyperlinks.$remove(data)
        },
        value: function() {
            return this.hyperlinks;
        }
    }
})
Vue.component('hyperlink-group', HyperlinkGroup)