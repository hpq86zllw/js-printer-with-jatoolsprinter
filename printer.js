/**
 * @name Printer With JatoolsPrinter
 * @author Camel
 */
(function($) {

	var PrinterBuilder = (function() {

		var instance = null;

		function Printer(config) {

			// 打印内容容器
			this.container = $("<div/>").attr("id", "printerContentContainer")
					.css("display", "none");
			// pagePrefix不能修改，控件固定使用这个分页前缀，要打印的div对象在document中，div的id为page1将作为第一页打印，page2作为第二页打印，以此类推
			this.pagePrefix = "page";
			this.plugin = {
				// 这里使用了第三方Web打印控件jatoolsPrinter，*只支持使用IE内核的浏览器*

				// 控件id
				id : "jatoolsPrinter",
				// 控件classid
				classId : "CLSID:B43D3361-D075-4BE2-87FE-057188254255",
				// 控件下载路径
				path : config.pluginPath + "#version=8,6,0,0",
				settings : {
					// 控件帮助文档，http://printfree.jatools.com/document.html
					documents : document,
					// *copyrights不能改*
					copyrights : "杰创软件拥有版权  www.jatools.com"
				},
				instance : null,

				// 生成控件html代码
				generate : function() {
					return "<object id=\"" + this.id + "\" classid=\""
							+ this.classId + "\" codebase=\"" + this.path
							+ "\" style=\"display: none;\"></object>";
				}

			};

			this.init = function() {
				// 删除已加载的打印控件
				$("#" + this.plugin.id).remove();
				// 初始化加载控件，获取控件实例
				$(this.plugin.settings.documents.body).append(this.plugin.generate());
				$(this.plugin.settings.documents.body).append(this.container);
				this.plugin.instance = $("#" + this.plugin.id)[0];
			};
			this.print = function(arg0, arg1) {

				if(1 == arguments.length){
					// 生成打印内容
					this.generateContent(arg0);
					// confirm为true则弹出确认框，否则不弹
					this.plugin.instance.print(this.plugin.settings, false);
				}else if(2 == arguments.length){
					// 生成打印内容
					this.generateContent(arg0);
					// confirm为true则弹出确认框，否则不弹
					this.plugin.instance.print(this.plugin.settings, arg1);
				}

			};
			this.preview = function(arg0) {

				if(1 == arguments.length){
					// 生成打印内容
					this.generateContent(arg0);
				}

				this.plugin.instance.printPreview(this.plugin.settings);

			};
			this.generateContent = function(content) {

				// 清除打印容器中的内容
				this.clear();

				// 将内容全部push进contentArray中
				var contentArray = new Array();
				if (content instanceof Array) {
					for (var i = 0; i < content.length; i++) {
						// 需要封装成jquery克隆对象，否则原dom对象会被修改
						contentArray.push($(content[i]).clone());
					}
				} else if (content) {
					// 需要封装成jquery克隆对象，否则原dom对象会被修改
					contentArray.push($(content).clone());
				} else {
					return;
				}

				// 创建分页，id为page+页码，如page1、page2
				for (var i = 0; i < contentArray.length; i++) {
					var page = $("<div/>")
							.attr("id", this.pagePrefix + (i + 1)).append(
									$(contentArray[i]).html());
					this.container.append(page);
				}

			};
			this.clear = function() {
				// 清除打印容器中的内容
				this.container.empty();
			};

		}

		return {
			build : function(config) {
				if (null == instance) {
					instance = new Printer(config);
					instance.init();
				}
				return instance;
			}
		};

	})();

	$.newPrinter = function(config) {

		// 若使用的浏览器不是IE内核，将返回null
		if (-1 == navigator.userAgent.indexOf("MSIE")
				&& -1 == navigator.userAgent.indexOf("msie")) {
			return null;
		}

		// 创建打印控件实例，使用的是单例模式
		return PrinterBuilder.build(config);

	};

})(jQuery);
