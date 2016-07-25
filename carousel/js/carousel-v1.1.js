/**
 * Created by vecent on 2016/7/22.
 */

+function(window,document,$){
    $.fn.carousel = function(options){
        var self = this;
        // 默认参数
        var DEFAULTS = {
           loop       : true,     // TODO 是否循环切换
           autoplay   : false,    // 是否自动切换，默认为false，不自动切换
           speed      : 300,      // 轮播速度
           duration      : 3000,  // 轮播间隔时间，，单位毫秒
           prevButton : null,     // 上一页按钮
           nextButton : null,     // 下一页按钮
           pagination : null,     // 分页器(小圆点)父容器
           title      : null,     // 新闻标题 
        };
        // 加载功能参数
        var options = $.extend({},DEFAULTS,options);
        return this.each(function(){
            var curIndex = 0,                                  // 第一个版面，索引为0
                $btnPrev    = $(options.prevButton),           // 上一页按钮               
                $btnNext    = $(options.nextButton),           // 上一页按钮
                $li         = $(".carousel-lists li",this),    // 需要切换的li选项
                len         = $li.length,                      // 版面数量(图片数量)
                $carlTitle  = $(".carousel-title",this),       // title容器对象
                $pagination = $(options.pagination);           // 分页器父容器

            /** 获得图片宽高作为容器的宽高*/
            $(this).css({
                "width" : $li.find('img').innerWidth(),
                'height': $li.find('img').innerHeight()
            });

            /** 生成指示器内容 */
            if(options.pagination){
                // 小圆点数量和图片一样
                var listsItem = "";
                for(var i=0; i<len; i++){
                  if(i == 0){
                    listsItem += '<li class="hover"></li>';
                  }else{
                    listsItem += '<li></li>';
                  }
                }
              $pagination.append(listsItem); 
            }
            
            /** 如果没有新闻标题，分页器居中显示，否则靠右显示 */
            var pagiWidth = $pagination.width();
            $pagination.width(pagiWidth);
            if(options.title){
              // 带有标题
              $pagination.css({'right': '20px'});
            }else{
             $pagination.css({
                   'left': "50%", 
                   'marginLeft': -(Math.ceil(pagiWidth / 2))+'px'
              });
            }

            // 分页指示器
            var $paginList  = $('li',$pagination);    

            /** 单击上一页按钮 */
            self.on('click',options.prevButton,function(){
               curIndex--;
               // 若当前是第一个版面，再单击上一页就切换到最后一个版面
               if(curIndex < 0){
                 curIndex = $li.length-1;
               }
               // 切换版面
               switchImg(curIndex);
             });

            /** 单击下一页按钮 */
            self.on("click",options.nextButton,function(){
              curIndex++;
              // 若当前是最后一页，再单击下一页就切换到第一个版面
               if( curIndex == $li.length){
                   curIndex = 0
               }
               // 切换版面
               switchImg(curIndex);
            });

            /** 单击分页指示器跳转到分页指示器对应的页面 */
            $pagination.on("click",'li',function(){
              // 版面版面curIndex设置
               curIndex = $(this).index();
               // 切换版面
               switchImg(curIndex); 
             })

            
            /** 3s内自动切换版面 */
            var autoplayer;
            autoSwitch(autoplayer);

            /** 鼠标移动到图片上清除定时器，移除恢复定时器 */
            $li.hover(function(){
                options.autoplay && clearInterval(autoplayer);
            },function(){
                autoSwitch(autoplayer);
            });
            
            /** 切换版面 */
            function switchImg(curIndex){
               /** 1、分页指示器切换到curIndex处 */
               // 将所有指示器移除hover样式，将curIndex对应指示器设为hover
               $paginList.removeClass('hover');
               $paginList.eq(curIndex).addClass('hover');

               /** 开始切换版面 */
               // 2、先隐藏多余版面，在把当前版面显示出来且将title设为当前图片对应的title
               var $curLi = $li.eq(curIndex);
               $li.fadeOut(options.speed);
               $curLi.fadeIn(options.speed);

               // 3、切换版面title
               options.setTitle && options.setTitle.call(null,curIndex);
            }
            
           /** 定时切换版面 */ 
           function autoSwitch(){
             if(options.autoplay){
                autoplayer = setInterval(function(){
                   $btnNext.click();
                },options.duration);
              }
           }
        }); // each()

    }
}(window,document,$);
