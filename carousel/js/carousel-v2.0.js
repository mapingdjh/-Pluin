/**
 * @description:   焦点图插件
 * @author      ：  maping(2016-07-25)
 */

+function(window,document,$){
    var Carousel = function(element,options){
        this.$element = $(element);           // 调用插件方法的jquery对象，如$('.carousel')
        this.options = $.extend({},Carousel.DEFAULTS,options);
        console.log(this.options);
        this.init();
    };
    // 默认参数
    Carousel.DEFAULTS = {
        loop       : true,     // TODO 是否循环切换
        autoplay   : false,    // 是否自动切换，默认为false，不自动切换
        speed      : 300,      // 轮播速度
        duration   : 3000,     // 轮播间隔时间，，单位毫秒
        prevButton : null,     // 上一页按钮
        nextButton : null,     // 下一页按钮
        pagination : null,     // 分页器(小圆点)父容器
        title      : null,     // 新闻标题
    };
    Carousel.prototype.init = function(){
        this.curIndex = 0;                                                 // 第一个版面，索引为0
        this.$btnPrev    = $(this.options.prevButton);                    // 上一页按钮
        this.$btnNext    = $(this.options.nextButton);                    // 上一页按钮
        this.$li         = $(".carousel-lists li",this.$element);         // 需要切换的li选项
        this.len         = this.$li.length;                               // 版面数量(图片数量)
        this.$carlTitle  = $(".carousel-title",this.$element);            // title容器对象
        this.$pagination = $(this.options.pagination);                    // 分页器父容器

        // 变量保护，防止参数传递错误，导致程序中断、异常
        this.options.duration = this.options.duration || 3000;
        this.options.speed    = this.options.speed    || 300;


        /** 获得图片宽高作为容器的宽高*/
        this.$element.css({
            "width" : this.$li.find('img').innerWidth(),
            'height': this.$li.find('img').innerHeight()
        });
        /** 生成指示器内容,以及位置处理 */
        this.createPagin();
        /** 初始化事件 */
        this.initEvent();
    };

    Carousel.prototype.createPagin = function(){
        /** 生成指示器内容 */
        if(this.options.pagination){
            // 小圆点数量和图片一样
            var listsItem = "";
            for(var i=0; i<this.len; i++){
                if(i == 0){
                    listsItem += '<li class="hover"></li>';
                }else{
                    listsItem += '<li></li>';
                }
            }
            this.$pagination.append(listsItem);
        }

        /** 如果没有新闻标题，分页器居中显示，否则靠右显示 */
        var pagiWidth = this.$pagination.width();
        this.$pagination.width(pagiWidth);
        if(this.options.setTitle){
            // 带有标题
            this.$pagination.css({'right': '20px'});
        }else{

            this.$pagination.css({
                'left': "50%",
                'marginLeft': -(Math.ceil(pagiWidth / 2))+'px'
            });
        }
    };

    /** 切换版面 */
    Carousel.prototype.switchImg = function(curIndex){
        /** 1、分页指示器切换到curIndex处 */
        // 将所有指示器移除hover样式，将curIndex对应指示器设为hover
        this.$paginList.removeClass('hover');
        this.$paginList.eq(curIndex).addClass('hover');

        /** 开始切换版面 */
        // 2、先隐藏多余版面，在把当前版面显示出来且将title设为当前图片对应的title
        var $curLi = this.$li.eq(curIndex);
        this.$li.fadeOut(this.options.speed);
        $curLi.fadeIn(this.options.speed);

        // 3、切换版面title
        this.options.setTitle && this.options.setTitle.call(null,curIndex);
    };

    /** 定时切换版面 */
    Carousel.prototype.autoSwitch = function(){
        var self = this;
        if(self.options.autoplay){
            self.autoplayer = setInterval(function(){
                self.$btnNext.click();
            },self.options.duration);
        }
    };

    Carousel.prototype.initEvent = function(){
         var self       = this;
         self.autoplayer  = null;                         // 定时器对象
         self.$paginList = $('li',self.$pagination);       // 小圆点对象

        /** 单击上一页按钮 */
        self.$element.on('click',self.options.prevButton,function(){
            self.curIndex--;
            // 若当前是第一个版面，再单击上一页就切换到最后一个版面
            if(self.curIndex < 0){
                self.curIndex =self.$li.length-1;
            }
            // 切换版面
            self.switchImg(self.curIndex);
        });

        /** 单击下一页按钮 */
        self.$element.on("click",self.options.nextButton,function(){
            self.curIndex++;
            // 若当前是最后一页，再单击下一页就切换到第一个版面
            if( self.curIndex == self.$li.length){
                self.curIndex = 0
            }
            // 切换版面
            self.switchImg(self.curIndex);
        });

        /** 单击分页指示器跳转到分页指示器对应的页面 */
        self.$pagination.on("click",'li',function(){
            // 版面版面curIndex设置
            self.curIndex = $(this).index();
            // 切换版面
            self.switchImg(self.curIndex);
        });

        /** 3s内自动切换版面 */
        self.autoSwitch();
        /** 鼠标移动到图片上清除定时器，移除恢复定时器 */
        self.$li.hover(function(){
            self.options.autoplay && clearInterval(self.autoplayer);
        },function(){
            self.autoSwitch(self.autoplayer);
        });
    };

    /** 定义插件 */
    function Plugin(option){
        var args = Array.prototype.slice.call(arguments, 1);
        var returnValue = this;
        this.each(function(){
            var $this = $(this),
                data = $this.data('mg.carousel'),
                options = typeof option === 'object' && option;
            if(!data){
                $this.data('mg.carousel',(data = new Carousel(this,options)));
            }
            if(typeof option === 'string'){
                returnValue = data[option].apply(data, args) || returnValue;
            }
        });
        return returnValue;
    }

    var old = $.fn.carousel;
    $.fn.carousel = Plugin;
    $.fn.carousel.Constructor = Carousel;

    /** 防插件冲突 */
    $.fn.carousel.noConflict = function(){
        console.log(123);
        $.fn.carousel = old;
        return this;
    }
}(window,document,$);
