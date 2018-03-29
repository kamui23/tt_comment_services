const btnComment = $("#btn-comment")
const frmComment = $("#frm-comment")
const replComment = $("#repl-comment");
const listComments = $("#list-comments")
const frmName = $("#frm-name")
const replName = $("#repl-name")
const notify = $("span.notify")
const alert = $("span.message")
const publicMessage = $("#public-messages").children("#messages")
var player0 = function (playerName, message, cid) { 
	return "<div class='col-lg-12 player0'><p class='label label-success'>" + playerName + "</p><div class='well'>" + message + "</div><div class='sencond-line'><span class='crte-time'>2017 </span><a class='repl-btnx' href='javascript: void(0)' data-cid="+cid+" onclick='show(this);'>Phản hồi</a></div><div class='row sub-comments'></div></div>";
}
var player1 = function (playerName, message) { 
	return "<div class='col-lg-10 player0' style='padding-left: 40px;'><p class='label label-info'>" + playerName + "</p><div class='well'>" + message + "</div></div>";
}
var itemMessage = function (message) {
	return "<li class='list-group-item list-group-item-success'>" + message + "</li>";
}

// var socketer = io.sails.connect();
// socketer.on("connect", function () {
// 	console.log("Connected");
// });

function show(el) {
	$('#repl-cmt-box').css("display", "block");
	console.log(jQuery(el));
	jQuery(el).parent().parent().children('.sencond-line').append($('#repl-cmt-box'));
	jQuery(el).next().children("#cid-data-rep").val(jQuery(el).attr("data-cid"));
}

$('#btn-repl-comment').on("click", function() {
	let comment = replComment.val();
	let name = replName.val();
	let cid = $("#cid-data-rep").val();
	let app = $('#btn-repl-comment');
	if(!name || name.length < 2 || typeof name == "undefined") {
		name = "MOD-0101"
	}
	io.socket.post('/post-demo', {name: name, comment: comment, reply_to: cid}, function (resData, jwRes) {
		if(parseInt(resData.status) == 1) {
			let comment = player1(resData.data.u, resData.data.c);
			listSubComments = app.parent().parent().parent().parent().children(".sub-comments");
			listSubComments.prepend(comment);
		}
	});
	replComment.val("");
	replName.val("");
	$('#repl-cmt-box').css("display", "none");
});

btnComment.on("click", function () {
	let comment = frmComment.val();
	let name = frmName.val();
	if(!name || name.length < 2 || typeof name == "undefined") {
		name = "MOD-0101"
	}
	io.socket.post('/post-demo', {name: name, comment: comment}, function (resData, jwRes) {
		if(parseInt(resData.status) == 1) {
			let comment = player0(resData.data.u, resData.data.c);
			listComments.prepend(comment);
		}
	});
});


io.socket.on("commented", function (event) {
	if(parseInt(event.status) == 1) {
		if (event.data.r != 0) {
			$('.repl-btnx').each(function () {
				if ($(this).attr("data-cid") == event.data.r) {
					let subcomment = player1(event.data.u, event.data.c);
					listSubComments = $(this).parent().parent().children(".sub-comments");
					listSubComments.prepend(subcomment);
				} 
			});
		}
		else {
			let comment = player0(event.data.u, event.data.c);
			listComments.prepend(comment);
			let newlyCom = parseInt(notify.text());
			if(isNaN(newlyCom)) {
				newlyCom = 0;
			}
			notify.text(newlyCom + 1);
				}
			}
})

io.socket.get('/demo-comment', (resData, jwRes) => {
	if(parseInt(resData.status) == 1) {
		resData.data.forEach(function(cmt) {
			let comment = player0(cmt.uname, cmt.content, cmt.cid);
			listComments.append(comment);
			console.log(cmt.subcomments);
			if (cmt.subcomments.length != 0) {
				cmt.subcomments.forEach(function(subcmt) {
					let subcomment = player1(subcmt.uname, subcmt.content);
					listSubComments = $('.repl-btnx').parent().parent().children(".sub-comments");
					listSubComments.append(subcomment);
				})
			}
		});
	}
});
io.socket.on('connected', event => {
	let item = itemMessage(event.message)
	publicMessage.prepend(item)
})