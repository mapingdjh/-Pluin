/**
 * Created by vecent on 2016/7/22.
 */

+function(window,document,$){
    $.fn.carousel = function(options){
 
        // 默认参数
        var DEFAULTS = {
           autoplay   : false,    // 是否自动切换，默认为false，不自动切换
           speed      : 3000,     // 轮播间隔时间，，单位毫秒
        };
        var options = $.extend({},DEFAULTS,options);

        console.log(options);
        return this.each(function(){
            var curIndex = 0,                                          // 第一个版面，索引为0
                $btn      = $("button",this),                          // 上一页、下一页按钮
                $li       = $(".carousel-lists li",this),              // 需要切换的li选项
                $carlTitle= $(".carousel-title",this),                 // title容器对象
                $paginList= $('.carousel-pagination li',this);         // 分页指示器


            $btn.click(function(){
               /** 版面curIndex设置 */
               // 判断单击的是上一页按钮还是下一页按钮，单击上一页按钮版面减一，下一页按钮版面加一
               $(this).is('.carousel-next') ? curIndex++ : curIndex--;
               // 若当前是最后一页，再单击下一页就切换到第一个版面
               if( curIndex == $li.length){
                   curIndex = 0
               }
               // 若当前是第一个版面，再单击上一页就切换到最后一个版面
               if(curIndex < 0){
                 curIndex = $li.length-1;
               }
               // 切换版面
               switchImg(curIndex);
            });

            /** 单击分页指示器跳转到分页指示器对应的页面 */
            $paginList.click(function(){
               // 版面版面curIndex设置
               curIndex = $(this).index();
               // 切换版面
               switchImg(curIndex); 
            });

            console.log($btn.last().click);  // ???可以打印事件
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
               $li.fadeOut(300);
               $curLi.fadeIn(300);

               /** 3、切换版面title */
               var title = $curLi.find("img").attr('alt');
               $carlTitle.find('a').text(title);
            }
            
           /** 定时切换版面 */ 
           function autoSwitch(){
             if(options.autoplay){
                autoplayer = setInterval(function(){
                   $btn.last().click();
                },options.speed);
              }

           }

        }); // each()

    }
}(window,document,$);
