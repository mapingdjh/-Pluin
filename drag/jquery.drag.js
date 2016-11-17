/**
 * 1、基本思路：
 ****** mousedown按下某个元素，记录当前元素的坐标：curX,curY(绝对定位时的left和top值)
 ****** 然后记录单击鼠标时的坐标点：mouseX,mouseY(e.clientX,e.clientY);
 ****** mousemove时计算元素的新位置：(e.clientX - mouseX + curX)和(e.clientY - mouseY + curY）;
 ****** mouseup:
 释放，此时需要标记元素不可拖动，即将当前元素对象置空，对象不存在了当然不能拖动
 ****** 被拖拽的元素要使用定位才能够拖拽

 * 2、注意：
 ******  2.1、mousemove和mouseup需要绑定到doucment上，防止拖动过快导致元素延迟或抖动
 ******  2.2、拖动文字和图片问题
 ************ 拖动文字,不选择文字： ele.onselectstart = function(){ return false}
 ************ 拖动图片时,取消打开新页面： ele.ondragstart = function(){ return false}
 ********2.3.关于拖动多个对象问题：
 需要保证同时只有一个元素在拖动，当前元素的唯一性；
 区分开不同元素的坐标问题
 当前拖动元素的层级要最高，否则两个元素交替时，正在拖动元素可能会盖住
 ********2.4.元素拖动时的边界问题
 元素的上下左右边界必须在页面可视区域内，不能把元素的一半都拖动页面外面了
 ********2.5.拖动元素的某一部分(比如百度云：登录页，只能拖动头部，拖动头部就可以拖动整个页面)
 *
 * 收货：
 * 1、用原生js传递样式对象批量设置css样式。就像jquery中：$().css({})
 * 2、原生js的实现链试操作： 在方法中返回调用方法对象即可；
 * 3、如何在自调函数外使用自调函数内的方法:  把函数注册到window对象即可，window.drag = drag;
 */


;(function(window,$){
	/** 被拖拽元素对象 */
	function DragElement(node){
		this.node = node;
		//浏览器中默认允许拖动图片到新标签页打开，要先禁止，否则影响效果。如果你要拖动的不是图片，可以去掉
		this.node.ondragstart = function () {
			return false;
		};
		//如果要拖动的元素可以选中内容，则有必要禁止选中
		this.node.onselectstart = function () {
			return false;
		};
	}

	/** 设置布局时top、left值*/
	DragElement.prototype.setLayoutPistion = function(curX,curY){
		this.curX = curX || 0;
		this.curY = curY || 0;
		return this;
	};

	/** mousemove时设置元素的样式，cssObj是样式对象 */
	DragElement.prototype.setEleStyle = function(cssObj){
		$(this.node).css(cssObj);
		return this;
	};

	/** 鼠标 */
	function Mouse(){
		this.mouseX = 0;
		this.mouseY = 0;
	}

	//保存mousedown时鼠标的坐标
	Mouse.prototype.setMousePosition = function(mouseX,mouseY){
		this.mouseX = mouseX;
		this.mouseY = mouseY;

	};

	var DropConfig = {
		zIndex: 1,             // 当前拖动元素的层级
		dragingEle: null,      // 当前正在拖动元素对象
		mouse: new Mouse()     // 当前正在拖动元素的鼠标对象
	};

	// 拖动入口函数
	function drag(eleObj){
		// eleObj.querySelector(".draggable"): 可拖动的具体范围
		var dragNode = eleObj.querySelector(".draggable") || eleObj;
		// mousedown
		$(dragNode).bind("mousedown",function(e){
			var e = e || window.event;
			// 注意创建对象不是dragNode，而是页面传来的eleObj
			DropConfig.dragingEle = new DragElement(eleObj);
			// 保存元素布局时的left和top值
			var curX = $(eleObj).offset().left,
				 curY =$(eleObj).offset().top;
			DropConfig.dragingEle.setLayoutPistion(curX,curY)
						.setEleStyle({
							"z-index": DropConfig.zIndex++
						});
			// 保存鼠标按下时的坐标值
			DropConfig.mouse.setMousePosition(e.clientX,e.clientY);
		}).bind("mouseover",function(){
			$(this).css("cursor","move");
		}).bind("mouseout",function(){
			$(this).css("cursor","default");
		});

		function move(e){
			var e = e || window.event,
				mouseObj =  DropConfig.mouse,
				dragObj  = DropConfig.dragingEle;
			// 只有mousedown按下某个元素后才可拖动
			if(DropConfig.dragingEle){
				var moveX,moveY;
				moveX = e.clientX - mouseObj.mouseX  + dragObj.curX;
				moveY = e.clientY - mouseObj.mouseY  + dragObj.curY;

				/** 边界控制 */
				// 左边界
				if(moveX <= 0){
					moveX = 0;
				}
				// 右边界: 注意：getStyle(eleObj不能使用eleObj，应使用dragObj.node；
				var moveRightX = $(window).width() - $(dragObj.node).width();
				if(moveX >= moveRightX){
                   moveX = moveRightX;
				}
				// 上边界
				if(moveY <= 0){
					moveY = 0;
				}
				// 下边界
				var moveBottomY = $(window).height() - $(dragObj.node).height();
                if(moveY >= moveBottomY){
	                moveY = moveBottomY;
                }
				// 设置元素位置
				dragObj.setEleStyle({
					"left": moveX + "px",
					"top":  moveY + "px"
				});

				$(document).off("mousemove",move);
				// 由于onmousemove在一直调用，会造成一些性能问题，我们可以通过setTimout来延迟绑定onmousemove事件
				setTimeout(function () {
					$(document).on("mousemove", move);
				}, 25);
			}
		}

		// mousemove mouseup
		$(document).on({
			"mousemove": move,
			"mouseup": function(){
				DropConfig.dragingEle = null;
			}
		});
	}
	// 函数绑定到全局空间
	window.drag = drag;
})(window,$);