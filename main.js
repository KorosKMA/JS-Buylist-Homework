/**
 * Created by Administrator on 01.05.2017.
 */
$(function(){

    var LIST	=	$('.list-of-items');
    var NB_LABELS = $('.not-bought-labels');
    var B_LABELS = $('.bought-labels');

    var ITEM_TEMPLATE	=	$('.one-item').html();
    var LABEL_TEMPLATE	=	$('.one-label').html();

    var Labels = [];

    addItem("Помідори");
    addItem("Печиво");
    addItem("Сир");

    function addItem(name)	{

        var node	=	$(ITEM_TEMPLATE);	//Create	new	HTML	node

        var minus_button = node.find(".minus-button");
        var plus_button = node.find(".plus-button");
        var remove_button = node.find(".remove-button");
        var buy_button = node.find(".buy-button");
        var title = node.find(".title");

        node.find(".title").text(name);	//Set	product	title

        var node_label = $(LABEL_TEMPLATE);
        node_label.find(".label-title").text(name);

        //Delete	Action
        remove_button.click(function(){
            if(!remove_button.hasClass("inactive"))
                removeNode(node, node_label);
        });

        plus_button.click(function(){
            if(!plus_button.hasClass("inactive")) {
                if (minus_button.hasClass("inactive"))
                    minus_button.removeClass("inactive");
                increaseNodeAmount(node, node_label, 1);
            }
        });

        minus_button.click(function(){
            if(!minus_button.hasClass("inactive"))
                increaseNodeAmount(node, node_label, -1, minus_button);
        });

        buy_button.click(function(){
            if(!buy_button.hasClass("inactive"))
                buyNode(node, node_label, minus_button, plus_button, remove_button, buy_button, title);
            else
                unbuyNode(node, node_label, minus_button, plus_button, remove_button, buy_button, title);
        });

        node.on("click", ".title", function(){
            var old_name = title.text();
            if(!title.hasClass("inactive"))
                title = getTitle(node, node_label, title);
            title.focusout(function(){
                title = setTitle(node, node_label, title, old_name);
            });
        });

        initNode(node, node_label);
        Labels.push(node_label);
    }

    function initNode(node, node_label) {
        LIST.append(node);  //Add	to	the	end	of	the	list
        NB_LABELS.append(node_label);

        node.removeClass("hidden");
        node_label.removeClass("hidden");

        node.hide(0, function(){
            node_label.hide();
            node.slideDown(250);
            node_label.fadeIn(250);
        });
    }

    function removeNode(node, node_label){
        Labels.splice(Labels.indexOf(node_label), 1);
        node.slideUp(250, function(){
            node.remove();
        });
        node_label.fadeOut(250, function(){
            node_label.remove();
        });
    }

    function increaseNodeAmount(node, node_label, inc, minus_button){
        var quantity = node.find(".quantity");
        var amount = parseInt(quantity.text(), 10) + inc;
        if(amount <= 1) {
            amount = 1;
            minus_button.addClass("inactive");
        }
        quantity.fadeOut(100, function(){
            quantity.text(amount);
            quantity.fadeIn(100);
        });
        node_label.find(".circle").text(amount);
    }

    function buyNode(node, node_label, minus_button, plus_button, remove_button, buy_button, title){
        minus_button.addClass("inactive");
        plus_button.addClass("inactive");
        remove_button.addClass("inactive");
        buy_button.addClass("inactive");
        title.addClass("inactive");

        node.fadeOut(125, function(){
            minus_button.hide();
            plus_button.hide();
            remove_button.hide();
            node.find(".title").addClass("crossed");
            buy_button.text("Не куплено");
            buy_button.attr("data-tooltip", "Відмінити купівлю");
            node.fadeIn(125);
        });

        node_label.fadeOut(125, function(){
            node_label.remove();
            node_label.hide();
            node_label.addClass("crossed");
            node_label.find(".circle").addClass("crossed");
            B_LABELS.append(node_label);
            node_label.fadeIn(125);
        });
    }

    function unbuyNode(node, node_label, minus_button, plus_button, remove_button, buy_button, title)
    {
        node.fadeOut(125, function(){
            if(parseInt(node.find(".quantity").text(), 10) > 1)
                minus_button.removeClass("inactive");
            plus_button.removeClass("inactive");
            remove_button.removeClass("inactive");
            buy_button.removeClass("inactive");
            title.removeClass("inactive");

            minus_button.show();
            plus_button.show();
            remove_button.show();
            node.find(".title").removeClass("crossed");
            buy_button.text("Куплено");
            buy_button.attr("data-tooltip", "Позначити купленим");
            node.fadeIn(125);
        });

        node_label.fadeOut(125, function(){
            node_label.remove();
            node_label.hide();
            node_label.removeClass("crossed");
            node_label.find(".circle").removeClass("crossed");
            NB_LABELS.append(node_label);
            node_label.fadeIn(125);
        });
    }

    function getTitle(node, node_label, title){
        title.replaceWith('<input type="text" class="title-change" placeholder="Нова назва" value="'+title.text()+'"/>');
        title = node.find('input[type="text"]');
        title.focus();
        return title;
    }

    function setTitle(node, node_label, title, old_name){
        var name = title.val();
        if(name.length == 0)
            name = old_name;
        title.replaceWith('<div class = "title">'+ name + '</div>');
        node_label.find(".label-title").text(name);
        title = node.find('.title');
        return title;
    }

    var main_text_form = $('.input-field').find('input[type="text"]');
    var red = false;

    main_text_form.focus(function(){
        if(red) {
            main_text_form.removeClass("red-placeholder");
            main_text_form.attr("placeholder", "Назва товару");
            red = false;
        }
    });

    main_text_form.keypress(function(e){
        if(red){
            main_text_form.removeClass("red-placeholder");
            main_text_form.attr("placeholder", "Назва товару");
            red = false;
        }
        if(e.keyCode == 13)
            main_text_form.submit();
    });

    main_text_form.submit("enterKey", function(){
        addFromTextForm(main_text_form);
    });

    $('.input-field').find(".text-input-button").click(function(e){
        e.preventDefault();
        main_text_form.focus();
        main_text_form.submit();
    });

    function addFromTextForm(text_form){
        if(text_form.val().length == 0)
            return;
        var exists = false;
        Labels.forEach(function (label) {
            if(label.find(".label-title").text() == text_form.val()){
                text_form.val("");
                text_form.addClass("red-placeholder");
                text_form.attr("placeholder", "Такий товар вже є у списку");
                red = true;
                exists = true;
            }
        });
        if(exists)
            return;
        addItem(text_form.val());
        text_form.val("");
    }
});