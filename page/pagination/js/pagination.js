/**
 * @description: 分页组件
 * @author：maping(2016/11/13)
 * @update: 
 */

 function Pagination(element,options){
 	this.element = element;
 	this.options = $.extend({},Pagination.DEFAULTS,options);
 	this.init();
 }

 // 默认属性
 Pagination.DEFAULTS = {
    simple: false,          // 是否开启简化版分页，默认false，不开启
    copying: false,         // 是否开启首页和尾页：默认false不开启
    prevContent: "<",       // 上一页按钮内容 
    nextContent: ">",       // 下一页按钮内容
    firstPage: "首页" ,     // 首页按钮内容
    endPage: "尾页" ,       // 尾页按钮内容
    curPage: 1,             // 当前页，1为第一页
    pageSize: 5,            // 每页几条数据
    display: [2,3,2],       // 分页默认显示方式
    callback: function(){} 
 };

 Pagination.prototype.init = function(){
    // 语法检查: 如果参数不是number类型或者不能隐式转换成number类型
    if(isNaN(this.options.totalCount)){
        throw new Error("参数totalCount不正确或不是number类型！")
    }
    if(isNaN(this.options.pageSize)){
        throw new Error("参数pageSize只能是number类型！")
    }
    if(isNaN(this.options.curPage)){
        throw new Error("参数curPage只能是number类型！")
    }
 	// 总页数
 	this.totalPage = Math.ceil(this.options.totalCount / this.options.pageSize);
    // 创建dom
    this.createDom(this.options.curPage);
    // 初始化事件
    this.initEvent();
 };

// 创建dom
Pagination.prototype.createDom = function(curPage){
    this.element.empty();
	this.curPage    = curPage;
	this.pageSize   = this.options.pageSize;
	// 保护参数当前页大于总页数，把最后一页作为当前页
	this.curPage    = this.curPage > this.totalPage? this.totalPage: this.curPage;
    this.curPage    = this.curPage <= 0 ? 1 : this.curPage;
    // 总记录数小于每页显示记录数，则没有分页必要

    if(this.options.totalCount < this.pageSize) {
    	return;
    }
    if(this.options.simple){
       // 简化版分页
        var html = '<div class="mg-pagination">';
        // 上一页
        if(this.curPage <= 1){
            html += '<span class="prevpage nopage">'+this.options.prevContent+'</span>';
        }else{
            html += '<a href="javascript:;" class="prevpage">'+this.options.prevContent+'</a>';
        }
       html += `
            <div class="pagination-simple">
                <input type="text" value="${this.curPage}">
                <em class="slash">/</em>
                <span class="totalPage">${this.totalPage}</span>
            </div>
       `;
        // 下一页
        if(this.curPage === this.totalPage){
            html += '<span class="nextpage nopage">'+this.options.nextContent+'</span>'
        }else{
            html += '<a href="javascript:;" class="nextpage">'+this.options.nextContent+'</a>'
        }
        html += '</div>';
       this.element.append(html);
    }else{
        // 获得分页展现方式
        this.display = this.getDisPlay(this.curPage);
        // 创建复杂分页
        this.createPagination(this.display);
    }
    // 分页后回调
    typeof this.options.callback === 'function' && this.options.callback.call(this,this.curPage);
};

// 创建复杂分页
Pagination.prototype.createPagination = function(display){
	var curPage    = this.curPage,
	    totalPage  = this.totalPage;
    var html = '<div class="mg-pagination">';
    // 上一页
    if(curPage <= 1){
        html += '<span class="prevpage nopage">'+this.options.prevContent+'</span>';
    }else{
        html += '<a href="javascript:;" class="prevpage">'+this.options.prevContent+'</a>';
    }
    // 首页
    if(this.options.copying && curPage != 1){
        html += '<a href="javascript:;" class="firstPage" data-page="1">'+this.options.firstPage+'</a>';
    }else if(this.options.copying && curPage === 1){
         html += '<span class="firstPage nopage" data-page="1">'+this.options.firstPage+'</span>';
    }  
    // 返回的数字，说明总页数小于设定的分页个数，所以无需用省略号隐藏分页    
	if(typeof display === "number"){
        for(var i=0; i<display; i++){
            if(i === curPage-1){
                // 当前页不能单击跳转，所以用span标签
            	html += '<span class="curpage" data-page="'+(i+1)+'">'+(i+1)+'</span>';
            }else{
            	html += '<a href="javascript:;" data-page="'+(i+1)+'">'+(i+1)+'</a>';
            }
        }
	}else{
        // 需要省略号来隐藏多余的分页[[0,1],0,[5,7],0,[15,19]]
        for(var j=0; j<display.length;j++){
            data = display[j];
            if(data === 0){
                // 显示省略号
                html+= '<span>...</span>';
            }else{
                for(var n=data[0]; n<=data[1]; n++){
                    if(n === curPage-1){
                        html += '<span class="curpage" data-page="'+(n+1)+'">'+(n+1)+'</span>';
                    }else{
                        html += '<a href="javascript:;" data-page="'+(n+1)+'">'+(n+1)+'</a>';
                    }
                }
            }
        }
        
    }
    // 尾页
    if(this.options.copying && curPage < totalPage){
        html += '<a href="javascript:;" class="endPage" data-page='+totalPage+'>'+this.options.endPage+'</a>'
    }else if(this.options.copying && curPage >= totalPage){
        html += '<span class="endPage nopage" data-page='+totalPage+'>'+this.options.endPage+'</span>'
    } 
    // 下一页
    if(curPage === totalPage){
        html += '<span class="nextpage nopage">'+this.options.nextContent+'</span>'
    }else{
        html += '<a href="javascript:;" class="nextpage">'+this.options.nextContent+'</a>'
    }
    html += "</div>";
    this.element.append(html);
    
}

// 获得分页显示方式
Pagination.prototype.getDisPlay = function(curPage){
	// 定义分页显示方式需要显示的总页数(如[2,3,2]方式显示，共七页)
	var display = this.options.display;
	var maxPage = display[0] + display[1] + display[2];
    // 如果总页数比需要配置显示的的页数小，则不必用省略号隐藏页码
    if(this.totalPage < maxPage){
    	return this.totalPage;
    }
    var newDisplay = [];
    // 获取中间页页码的起始页码
    var start = curPage - Math.floor((display[1] - 1) / 2);
    start = start < 0 ? 0 : start;
    var end = curPage + Math.ceil((display[1]-1) / 2);
    end > this.totalPage ? this.totalPage : end; 
    // 若中间显示页的最后一页小于前和中显示页数，即前无...
    if(end < display[0] + display[1]){
    	newDisplay = [[0,display[0] + display[1] - 1], 0, [this.totalPage - display[2], this.totalPage -1]];
    }else if(this.totalPage - start <= display[1] + display[2]){
    	// 若总页数减去start后剩余的页数小于display[1]和display[2],后无省略号
        newDisplay = [ [0,display[0] - 1], 0 , [this.totalPage - display[1] -display[2], this.totalPage-1 ]];
    }else{
    	// 前后都有省略号
    	newDisplay = [
    		[0,display[0] - 1], 0,
    		[start,end], 0,
    		[this.totalPage -display[2], this.totalPage-1 ]
    	];
    }
    return newDisplay;
};

// 初始化事件
Pagination.prototype.initEvent = function(){
    var self = this;
    /** 事件绑定方式一 */

    /*// 单击上一页:排除置灰状态
    self.element.on("click",".prevpage:not('.nopage')",function(){
        self.curPage--;
        self.createDom(self.curPage);
    });

    // 单击下一页:排除置灰状态
    self.element.on("click",".nextpage:not('.nopage')",function(){
        self.curPage++;
        self.createDom(self.curPage);
    });

    // 单击某一页:标签不是span且不是上一页和下一页
    self.element.on("click",".mg-pagination a:not('.prevpage,.nextpage')",function(){
        var curPage = $(this).data("page");
        self.curPage = curPage;
        self.createDom(self.curPage);
    });*/

    /** 事件绑定方式2: 给所有a绑定事件，span不绑定事件 */
    self.element.on("click","a",function(){
        if($(this).is(".prevpage")){
            // 上一页
            self.curPage--;
        }else if($(this).is(".nextpage")){
            // 下一页
            self.curPage++;
        }else if($(this).is("[data-page]")){
            // 单击某个标签页: 包括首页和尾页
            var curPage = $(this).data("page");
            self.curPage = curPage;
        }
        // 创建分页
        self.createDom(self.curPage);
    });

    // 回车输入页码
    $(document).keydown(function(e){
        var val = parseInt($(".pagination-simple input").val());
        
        if(e.keyCode === 13 && (val >=0)){
            self.curPage = val;
            self.createDom(self.curPage);
        }
    });
};


// 定义插件
 $.fn.pagination = function(options){
    new Pagination(this,options);
 }