# Carousel焦点图插件使用方法 #
---
### 一、加载插件，需要用到的文件有carousel.js和carousel.css文件。##
    <!DOCTYPE html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>焦点图</title>
	    <link rel="stylesheet" href="css/carousel.css"/>
	</head>
	<body>
	 ...
	    <script src="js/carousel.js"></script>
	</body>
	</html>

### 二、html内容 ##
    <div class="carousel">
        <ul class="carousel-lists">
            <li class="active">slider1</li>
            <li>slider2</li>
            <li>slider3</li>                     
        </ul>
        
        <!-- 如果需要分页器 上一页、下一页按钮 -->
        <button class="carousel-prev"></button>
        <button class="carousel-next"></button>

        <!-- 如果需要title -->
        <h2 class="carousel-title"><a href="#">美国俄州遭遇龙卷风 已致91人死</a></h2>

        <!-- 如果需要分页器 -->
        <ul class="carousel-pagination"></ul>
    </div>

### 三、js部分 ##
    <script>
    $(function(){
	    var $carouselLists = $('.carousel-lists li'),
	    $title = $('.carousel-title');
	    $('.carousel').carousel({
		    autoplay   : true,// 开启自动播放
		    duration   : 3000,// 轮播间隔时间
		    speed  : 300, // 轮播速度，值越小，速度越快
		    prevButton : ".carousel-prev",// 上一页按钮class
		    nextButton : ".carousel-next",// 下一页按钮class
		    pagination : ".carousel-pagination",  // 分页指示器父容器
		    setTitle   : function(curIndex){  // 开放的业务方法，设置标题,curIndex:当前版面标题
		    /** 切换版面title */
		    var title = $carouselLists.eq(curIndex).find("img").attr('alt'),
		    href = $carouselLists.eq(curIndex).find("a").attr('href');
		    $title.find("a").attr("href",href).text(title);
		    },
		});
     });
    </script>


### 四、参数说明 ##

<table class="" width="800">
  <tr>
    <th>参数</th>
    <th width="400">描述</th>
    <th>类型</th>
    <th>默认值</th>
  </tr>
  <tr>
    <td align="center">autoplay</td>
    <td>是否开启自动切换，true：自动切换，false： 不会自动切换</td>
    <td align="center">boolean</td>
    <td align="center">false</td>
  </tr>
  <tr>
    <td align="center">duration</td>
    <td>轮播间隔时间，单位：ms</td>
    <td align="center">number</td>
    <td align="center">3000</td>
  </tr>
  <tr>
    <td align="center">speed</td>
    <td>轮播速度，值越小，速度越快</td>
    <td align="center">number</td>
    <td align="center">300</td>
  </tr>
 <tr>
    <td align="center">prevButton</td>
    <td>上一页按钮class类名</td>
    <td align="center">string</td>
    <td align="center">null</td>
  </tr>
  <tr>
    <td align="center">nextButton</td>
    <td>上一页按钮class类名</td>
    <td align="center">string</td>
    <td align="center">null</td>
  </tr>
  <tr>
    <td align="center">pagination</td>
    <td>分页指示器父容器</td>
    <td align="center">string</td>
    <td align="center">null</td>
  </tr>
  <tr>
    <td align="center">setTitle()</td>
    <td>回调方法,仅对有标题页面生效</td>
    <td align="center">function</td>
    <td align="center">无</td>
  </tr>
</table>
