/* ==========================================================
 * soliloquy.js
 * http://soliloquygallery.com/
 * ==========================================================
 * Copyright 2013 Thomas Griffin.
 *
 * Licensed under the GPL License, Version 2.0 or later (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */
;(function($){
	$(function(){
	    // Lazy load images.
        $('img.soliloquy-site-preload').unveil(100, function(){
            $(this).load(function(){
                this.style.opacity = 1;
            })
        });

        // Fitvids.
        $('iframe').fitVids();

        // Custom OptinMonster button link based on page visited.
        $(document).on('OptinMonsterBeforeShow', function(e, data){
            var button = $('#om-' + data.hash).find('.button');
            if ( ! $('body').hasClass('page-template-templateslite-php') ) {
                $(button).text('Continue Purchasing Soliloquy 100% Risk Free!').attr('href', '#').attr('title', 'Click to continue purchasing Soliloquy 100% risk free.').addClass('soliloquy-remain');
            }

            $(document).on('click.closeCanvasOptin', '#om-' + data.optin + ' .soliloquy-remain', function(e){
                e.preventDefault();

                $('#om-' + data.optin).fadeOut(300, function(){
                    // Create a cookie.
                    pnchgvvok1_canvas.createCookie('om-' + data.optin, true, data.expires);

                    // If using a clone, make sure the clone has a cookie as well to prevent it from displaying.
                    if ( data._optin )
                        pnchgvvok1_canvas.createCookie('om-' + data._optin, true, data.expires);

                    // If the global setting is populated, set a global cookie.
                    if ( data.global_cookie )
                        pnchgvvok1_canvas.createCookie('om-global-cookie');
                });
            });
        });

        // Mobile navigation.
        $('<h3>Menu <a href="#" class="soliloquy-close-menu"><i class="fa fa-times"></i></a></h3>').prependTo($('#mobile-navigation'));
        var mobile_nav_displayed = pricing_modified = false;
    	function show_mobile_nav() {
    		if ( $(window).width() <= 1024 && mobile_nav_displayed == false) {
    			$('#header-navigation').hide();
    			$('.soliloquy-mobile-nav').fadeIn(300);
    			$('<p class="text-center text-small soliloquy-price-helper" style="margin-bottom: 5px;"><em>(click to view all features of a plan)</em></p>').prependTo($('.pricing-table'));
    			$('.pricing-table .feature-column li').each(function(){
        			if ( $(this).hasClass('plan-title') ) {
            			$(this).css('cursor', 'pointer').nextAll().hide();
        			}
    			});
    			if ( ! pricing_modified ) {
        			$('.pricing-table .feature-column').each(function(){
            			var clone = '$' + $(this).find('li.plan-price:first .price:last').html();
            			if ( $(this).parent().hasClass('pro-column') )
            			    $(this).find('h3').append('<span style="color:white"> ' + clone + '</span>');
                        else
                            $(this).find('h3').append('<span class="green"> ' + clone + '</span>');
        			});
        			$('.pricing-table .feature-column li').on('click', function(e){
        			    e.preventDefault();
        			    if ( $(this).hasClass('plan-title') && ! $(this).hasClass('price-open') ) {
            			    $(this).addClass('price-open').nextAll().slideDown(300);
        			    } else {
            			    $(this).removeClass('price-open').nextAll().slideUp(300);
        			    }
        			});
        			pricing_modified = true;
                }
    			mobile_nav_displayed = true;
    		} else if ( $(window).width() > 1024 && mobile_nav_displayed == true ) {
    		    $('.soliloquy-mobile-nav').hide();
    			$('#header-navigation').show();
    			$('.soliloquy-price-helper').remove();
    			$('.pricing-table .feature-column li').each(function(){
        			if ( $(this).hasClass('plan-title') ) {
            			$(this).show().css('cursor', 'default');
        			}
    			});
    			$('.pricing-table .feature-column li').on('click', function(e){
    			    e.preventDefault();
    			    if ( $(this).hasClass('plan-title') && ! $(this).hasClass('price-open') ) {
        			    $(this).addClass('price-open').nextAll().slideDown(300);
    			    } else {
        			    $(this).removeClass('price-open').nextAll().slideUp(300);
    			    }
    			});
    			mobile_nav_displayed = false;
    		}
    	}
    	show_mobile_nav();
    	$(window).resize(show_mobile_nav);

    	$('.soliloquy-mobile-nav, .soliloquy-close-menu').on('click', function(e){
    	    e.preventDefault();
    	    var mobile = $('#mobile-navigation');
    	    if ( mobile.hasClass('soliloquy-mobile-open') ) {
    	        mobile.removeClass('soliloquy-mobile-open');
            } else {
                mobile.addClass('soliloquy-mobile-open');
            }
    	});

        // Add custom class to header menu when scrolling on the site.
        $(window).scroll(function(){
            if ( $('body').hasClass('pricing') ) return;

            var scroll = $(window).scrollTop();
            if ( scroll >= 25 )
                $('.header-nav li:first').addClass('convert-active');
            else
                $('.header-nav li:first').removeClass('convert-active');
        });

        // Load the modal attributes.
        $('.soliloquy-login a, .soliloquy-contact a').attr('data-toggle', 'modal');
        $('body').append(soliloquyGetDynamic);

        // Style Gravity Forms for Bootstrap 3.
        soliloquyStyleGforms();

        // Remove padding from first nav menu item in footer.
        $('#footer li a:first').css('padding-left', 0);

        // Password recovery helper.
        $('.soliloquy-forgot-password').on('click', function(e){
            e.preventDefault();
            var recovery = $('.soliloquy-password-recovery');
            if ( recovery.is(':visible') ) {
                recovery.fadeOut(300);
            } else {
                recovery.fadeIn(300);
            }
        });

        // Send new password.
        $('.soliloquy-get-password').on('click', function(e){
            e.preventDefault();
            var $this = $(this),
                input = $this.prev().val();

            if ( input.length === 0 ) {
                $('.soliloquy-password-text').text('Please enter a valid username or email.').removeClass('text-success').addClass('text-danger');
            } else {
                $this.text('Processing...');
                $.post(edd_scripts.ajaxurl, { action: 'soliloquy_recover_password', user: input }, function(res){
                    if ( res && res.error ) {
                        $('.soliloquy-password-text').text(res.error).addClass('text-danger');
                    } else {
                        $('.soliloquy-password-text').text('Please check your email for the confirmation link to reset your password.').removeClass('text-danger').addClass('text-success');
                    }
                    $this.text('Get New Password');
                }, 'json');
            }
        });

        // Add class helpers to no-upgrade columns.
        $('.no-upgrade').each(function(){
            $(this).parent().addClass('no-upgrade-alt');
        });
        $('.account .pricing-table .col-lg-3:not(.no-upgrade-alt)').addClass('has-upgrade');

        // Load iframe videos on click.
        $('.soliloquy-video .video-icon').on('click', function(e){
            e.preventDefault();
            if ( $('#soliloquy-video').length === 0 ) {
                var $this  = $(this),
                    width  = $this.parent().width(),
                    height = width*9/16;
                $('<iframe id="soliloquy-video" src="//www.youtube.com/embed/' + $this.parent().data('video-id') + '?showinfo=0&showsearch=0&rel0&modestbranding=1&autoplay=1" allowfullscreen allowtransparency="true" frameborder="0" scrolling="no" width="' + width + '" height="' + height + '" style="position:absolute;top:0;left:0;z-index:1000;"></iframe>').appendTo($this.parent());
            }
        });

        // If an soliloquy video holder is already on the page, load in our video.
        if ( $('#soliloquy-video').length !== 0 ) {
            var $this  = $('#soliloquy-video'),
                width  = $this.parent().width(),
                height = width*9/16;
                $('<iframe id="soliloquy-video-inside" src="//www.youtube.com/embed/' + $this.data('video-id') + '?showinfo=0&showsearch=0&rel0&modestbranding=1" allowfullscreen allowtransparency="true" frameborder="0" scrolling="no" width="' + width + '" height="' + height + '"></iframe>').appendTo($this);
        }

        // Show all features on home page.
        $('.soliloquy-view-more-features').on('click', function(e){
            e.preventDefault();
            $(this).parent().parent().prev().find('.soliloquy-feature-hidden').each(function(){$(this).show()});
        });

        // Function to retrieve the modal information and loading the contact form.
        function soliloquyGetDynamic() {
            var html = '';
            html += '<div class="modal fade" id="loginmodal">';
                html += '<div class="modal-dialog">';
                    html += '<div class="modal-content">';
                        html += '<div class="modal-header">';
                            html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>';
                            html += '<h4 class="modal-title">Login to Your Account</h4>';
                        html += '</div>';
                        html += '<div class="modal-body">';
                            html += '<form class="form-horizontal">';
                                  html += '<div class="form-group">';
                                        html += '<label for="login-email" class="col-lg-2 control-label">Email</label>';
                                        html += '<div class="col-lg-10">';
                                            html += '<input type="text" id="login-email" class="form-control" placeholder="Email Address">';
                                        html += '</div>';
                                  html += '</div>';
                                  html += '<div class="form-group" style="margin-bottom:0;">';
                                        html += '<label for="login-password" class="col-lg-2 control-label">Password</label>';
                                        html += '<div class="col-lg-10">';
                                            html += '<input type="password" id="login-password" class="form-control" placeholder="Password">';
                                        html += '</div>';
                                        html += '<div class="col-lg-10 col-lg-offset-2">';
                                            html += '<p style="margin:15px 0 0;"><button type="submit" class="btn btn-primary btn-sm modal-login">Login</button></p>';
                                        html += '</div>';
                                  html += '</div>';
                            html += '</form>';
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
            html += '</div>';
            return html;
        }

        // Function for adding bootstrap styles to Gravity Forms.
        function soliloquyStyleGforms() {
            var gform = $(document).find('.gform_wrapper').attr('class');
            if(typeof gform !== 'undefined' && gform !== 'false'){
                    var form = $('.gform_wrapper');
                    var required = $('.gfield_contains_required');
                    var controlGroup = $('.gfield');
                    var greq = $('.gfield_required');
                    required.each(function(){
                        $(this).find('input, textarea, select').not('input[type="checkbox"], input[type="radio"]').attr('required', 'true');
                    });
                    greq.each(function(){
                        $(this).addClass('text-danger');
                    });
                    controlGroup.each(function(){
                        $(this).addClass('form-group').find('input, textarea, select').not('input[type="checkbox"], input[type="radio"]').after('<span class="help-block"></span>').addClass('form-control');
                    });
                    form.find("input[type='submit'], input[type='button']").addClass('btn btn-primary').end().find('.gfield_error').removeClass('gfield_error').addClass('has-error');
                    $('.gfield_checkbox, .gfield_radio').find('input[type="checkbox"], input[type="radio"]').each(function(){
                        var sib = $(this).siblings('label');
                        $(this).prependTo(sib);
                    }).end().each(function(){
                        $(this).after('<span class="help-block"></span>');
                        if($(this).is('.gfield_checkbox')){
                            $(this).addClass('checkbox');
                        } else {
                            $(this).addClass('radio');
                        }
                    });
                    $('.validation_message').each(function(){
                        var sib = $(this).prev().find('.help-block');
                        $(this).appendTo(sib);
                    });
                    $('.validation_error').addClass('alert alert-danger');
                    $('.gf_progressbar').addClass('progress progress-striped active').children('.gf_progressbar_percentage').addClass('progress-bar progress-bar-success');
            } else {
                return false;
            }
        }

        // Function for responsive navigation menus.
        function ResponsiveNav(nav, $){
        	/** Clone the nav, set the ID and use a concat var to store our data */
        	var nav_clone 	= $(nav).clone();
        	var id 			= '#' + $(nav_clone).attr('id');
        	var concat		= '';

        	/** Create the dropdown base and general option */
        	concat += '<select class="menu-primary-mobile">';
        	concat += '<option value="" selected="selected">Menu</option>';

        	/** Populate the dropdown menu with items */
        	$.each(nav_clone, function(){
        		$(this).find('a').each(function(i, el){
        			var el 	= $(this);
        			var sep = false;
        			switch ( $(this).parents('.sub-menu').length ) {
        				case 3 : sep = '--- '; break;
        				case 2 : sep = '-- '; break;
        				case 1 : sep = '- '; break;
        			}
        			if ( sep ) {
        				concat += '<option value="' + el.attr('href') + '">' + sep + el.children().remove().end().text() + '</option>';
        			} else {
        			    if ( el.find('.fa').length > 0 )
        			        concat += '<option value="' + el.attr('href') + '">Cart</option>';
        			    else
        				    concat += '<option value="' + el.attr('href') + '">' + el.children().remove().end().text() + '</option>';
                    }
        		});
        	});

        	/** Append the new menu to our current menu */
        	concat += '</select>';
        	$(nav).parent().append(concat);

        	/** Go to the href on user selection */
        	$('.menu-primary-mobile').change(function(){
        	    var selected = $(this).find('option:selected');
        	    if ( '#loginmodal' == selected.val() )
        	        return $('.soliloquy-login a').trigger('click');
                else if ( '#contactmodal' == selected.val() )
                    return $('.soliloquy-contact a').trigger('click');
                else
        		    return window.location = selected.val();
        	});
        }
	});
}(jQuery));

// jQuery plugins to load.
;(function($){$.fn.unveil=function(threshold,callback){var $w=$(window),th=threshold||0,retina=window.devicePixelRatio>1,attrib=retina?"data-src-retina":"data-src",images=this,loaded;this.one("unveil",function(){var source=this.getAttribute(attrib);source=source||this.getAttribute("data-src");if(source){this.setAttribute("src",source);if(typeof callback==="function")callback.call(this);}});function unveil(){var inview=images.filter(function(){var $e=$(this),wt=$w.scrollTop(),wb=wt+$w.height(),et=$e.offset().top,eb=et+$e.height();return eb>=wt-th&&et<=wb+th;});loaded=inview.trigger("unveil");images=images.not(loaded);}$w.scroll(unveil);$w.resize(unveil);unveil();return this;};})(window.jQuery||window.Zepto);
var HelloBar=function(m,r,t){var k=this,e="http://www.hellobar.com",I="The HelloBar - a little bar that gets noticed!",M="hellobar",K,w={},O=30,g=3,p=5,d={afterOpen:null,afterClose:null,onOpen:null,onClose:null,onReady:null,height:O,borderSize:g,showWait:0,hideAfter:-1,wiggleWait:15000,barColor:"#eb593c",shadow:true,textColor:"#ffffff",linkColor:"#80ccff",linkStyle:"button",forgetful:false,positioning:"sticky",transition:"bouncy",speed:500,closable:true,helloBarLogo:true,tabSide:"right",showTabInstantly:false,texture:""};var B=true,j=false,o=k.isOpen=true,L=["wrapper","container","content","shadow","logo","close","open","pusher"],R={},s={wrapper:{type:"DIV",style:"display:none;"},container:{type:"DIV"},content:{type:"DIV"},shadow:{type:"DIV"},logo:{type:"A",href:e,title:I,text:I,target:"_blank"},close:{type:"A",href:"#close",text:"Close",onclick:function(){k.close();return false},onmouseover:function(){A()},onmouseout:function(){E()}},open:{type:"A",href:"#close",text:"Open",onclick:function(){k.open();return false},onmouseover:function(){A()},onmouseout:function(){E()}},pusher:{type:"DIV"}};var y=navigator.userAgent.toLowerCase(),P={chrome:y.match(/chrome/)?true:false,firefox:y.match(/firefox/)?true:false,firefox2:y.match(/firefox\/2/)?true:false,firefox30:y.match(/firefox\/3\.[0-9]/)?true:false,firefox40:y.match(/firefox\/4\.[0-9]/)?true:false,msie:y.match(/msie/)?true:false,msie6:(y.match(/msie 6/)&&!y.match(/msie 7|8/))?true:false,msie7:y.match(/msie 7/)?true:false,msie8:y.match(/msie 8/)?true:false,chromeFrame:(y.match(/msie/)&&y.match(/chrome/))?true:false,opera:y.match(/opera/)?true:false,safari:(y.match(/safari/)&&!y.match(/chrome/))?true:false};function D(){var T={};for(var aa=0;aa<L.length;aa++){var V=L[aa],U=true;if(w.closable===false){if(V=="close"||V=="open"){U=false}}if(typeof(w.helloBarLogo)!="undefined"){if(w.helloBarLogo){if(V=="logo"){U=true}}}if(U===true){var ab;for(var ae in s[V]){var W=s[V][ae];switch(ae){case"type":ab=document.createElement(W);break;case"text":ab.appendChild(document.createTextNode(W));break;case"onclick":ab.onclick=W;break;case"onmouseover":ab.onmouseover=W;break;case"onmouseout":ab.onmouseout=W;break;default:ab.setAttribute(ae,W);break}}ab.id=R[V];T[V]=ab}}if(B===false){T.container.style.top=(0-(w.height+w.borderSize))+"px"}if(w.positioning=="fixed"||w.positioning=="sticky"){if(P.msie6){w.positioning="overlap";T.pusher.style.display="none"}}switch(w.positioning){case"push":break;case"overlap":T.wrapper.style.position="absolute";T.wrapper.style.width="100%";T.wrapper.style.top="0";T.wrapper.style.left="0";T.wrapper.style.zIndex="5000";break;case"fixed":T.wrapper.style.position="fixed";T.wrapper.style.width="100%";T.wrapper.style.top="0";T.wrapper.style.left="0";T.wrapper.style.zIndex="5000";break;case"sticky":T.wrapper.style.position="fixed";T.wrapper.style.width="100%";T.wrapper.style.top="0";T.wrapper.style.left="0";T.wrapper.style.zIndex="5000";break}T.container.style.height=w.height+"px";T.wrapper.style.height=w.height+"px";T.pusher.style.height=w.height+"px";if(w.height<60){if(typeof(w.helloBarLogo)!="undefined"){if(w.helloBarLogo){T.logo.style.marginTop="-11px";T.logo.style.top="50%"}}if(T.close){T.close.style.marginTop="-10px";T.close.style.top="50%"}}if(typeof(w.texture)!="undefined"){if(w.texture!==""){var ag=T.container.className.split(" ");ag.push("texture");ag.push(w.texture);T.container.className=ag.join(" ")}}if(typeof(w.tabRadius)!="undefined"){if(w.tabRadius!==""){var Z=["borderRadius","mozBorderRadius","webkitBorderRadius","oBorderRadius","khtmlBorderRadius"];for(var Y in Z){if(typeof(document.body.style[Z[Y]])!=="undefined"){T.open.style[Z[Y]]=w.tabRadius}}}}if(typeof(w.borderSize)!="undefined"){if(w.borderSize!==""){T.container.style.borderBottomWidth=w.borderSize+"px";T.shadow.style.bottom=(0-(w.borderSize+p))+"px";if(T.open){T.open.style.borderWidth=w.borderSize+"px"}}}if(typeof(w.borderColor)!="undefined"){if(w.borderColor!==""){T.container.style.borderBottomColor=w.borderColor;T.open.style.borderColor=w.borderColor}}if(typeof(w.shadow)!="undefined"){if(!w.shadow){T.shadow.style.display="none"}}if(typeof(w.barColor)!="undefined"){if(w.barColor!==""){q(w.barColor);T.container.style.backgroundColor=w.barColor;if(T.open){T.open.style.backgroundColor=w.barColor}}}if(typeof(w.textColor)!="undefined"){if(w.textColor!==""){T.container.style.color=w.textColor}}if(typeof(w.fontWeight)!="undefined"){if(w.fontWeight!==""){T.container.style.fontWeight=w.fontWeight}}if(typeof(w.fontStyle)!="undefined"){if(w.fontStyle!==""){T.container.style.fontStyle=w.fontStyle}}if(typeof(w.lineHeight)!="undefined"){if(w.lineHeight!==""){T.container.style.lineHeight=w.lineHeight}}else{T.container.style.lineHeight=w.height+"px"}if(typeof(w.fontSize)!="undefined"){if(w.fontSize!==""){T.container.style.fontSize=w.fontSize}}if(typeof(w.fonts)!="undefined"){if(w.fonts!==""){T.container.style.fontFamily=w.fonts}}if(typeof(w.googleFont)!="undefined"){if(w.googleFont!==""){if(typeof(WebFontConfig)=="undefined"){WebFontConfig={google:{families:[w.googleFont]}};(function(){var aj=document.createElement("script");aj.src=("https:"==document.location.protocol?"https":"http")+"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";aj.type="text/javascript";aj.async="true";var ai=document.getElementsByTagName("script")[0];ai.parentNode.insertBefore(aj,ai)})()}T.container.style.fontFamily=w.googleFont.split(":")[0].replace(/\+/g," ")}}var af=T.wrapper.className.split(" ");af.push(M+"-"+w.tabSide);af.push(M+"-"+w.imageStyle);if(w.linkStyle!="link"){af.push(M+"-"+w.linkStyle)}T.wrapper.className=af.join(" ");T.content.innerHTML=unescape(k.message.replace(/\+/g," "));T.container.appendChild(T.content);if(typeof(w.helloBarLogo)!="undefined"){if(w.helloBarLogo){T.container.appendChild(T.logo)}}if(typeof(T.logo)!="undefined"){T.logo.href=T.logo.href+="?utm_source="+document.location.hostname+"&utm_medium=hellobar&utm_campaign=HBSolo"}if(w.closable===true){T.container.appendChild(T.close)}T.container.appendChild(T.shadow);T.wrapper.appendChild(T.container);if(w.closable===true){T.wrapper.appendChild(T.open)}document.body.children[0].parentNode.insertBefore(T.wrapper,document.body.children[0]);if(w.positioning=="sticky"){document.body.children[0].parentNode.insertBefore(T.pusher,document.body.children[0])}var ah=document.getElementById("hellobar-container").getElementsByTagName("A");for(var X in ah){var ac=ah[X],ad=null;if(typeof(ad)=="function"){ad()}if(ac.id===""){if(typeof(w.linkColor)!="undefined"){if(w.linkColor!==""){ac.style.color=w.linkColor}}ac.onclick=function(){if(typeof(ad)=="function"){ad()}}}else{if(ac.id==M+"-logo"){ac.onclick=function(){if(typeof(ad)=="function"){ad()}return false}}}}}function h(){var V=document.cookie.split("; ");for(var U=0;U<V.length;U++){var T=V[U].split("=")[0],W=V[U].split("=")[1];if(T==M+"_"+t+"_hide"){B=W==1?false:true}if(T==M+"_"+t+"_shown"){j=W==1?true:false}}}function n(Y,V,ab){if(w.forgetful===true){return false}var Z=false,X=new Date(),aa=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],U=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Nov","Dec"],T=new Date(X.getTime()+(365*86400000));if(typeof(ab)!="undefined"){if(ab===true){T=new Date(X.getTime()-(1*86400000))}if(ab=="this_session"){Z=true}}var W=aa[T.getUTCDay()]+", "+T.getUTCDate()+" "+U[T.getUTCMonth()]+" "+T.getUTCFullYear()+" "+T.getUTCHours()+":"+T.getUTCMinutes()+":"+T.getUTCSeconds()+" UTC";if(Z){document.cookie=Y+"="+V+"; path=/"}else{document.cookie=Y+"="+V+"; expires="+W+"; path=/"}}function F(T){if(o){n(M+"_"+t+"_hide",1);n(M+"_"+t+"_shown",0,"this_session");if(typeof(w.onClose)=="function"){w.onClose(k,w,"onClose")}a(b(function(){if(typeof(w.afterClose)=="function"){w.afterClose(k,w,"afterClose")}if(typeof(T)=="function"){T(k,w,"afterClose")}}));o=k.isOpen=false}}function v(T){if(!o){if(w.hideAfter<w.showWait){clearInterval(window._hellobar_wiggleWaitTimer);clearTimeout(window._hellobar_hideAfterTimer)}n(M+"_"+t+"_hide",0,true);n(M+"_"+t+"_shown",1,"this_session");if(typeof(w.onOpen)=="function"){w.onOpen(k,w,"onOpen")}i(N(function(){if(typeof(w.afterOpen)=="function"){w.afterOpen(k,w,"afterOpen")}if(typeof(T)=="function"){T(k,w,"afterOpen")}}));o=k.isOpen=true}}function A(){k.elements.open.style.backgroundColor=z(w.barColor)}function E(){k.elements.open.style.backgroundColor=w.barColor}function S(){var T=3;return function(U){return((-Math.cos(U*Math.PI*((1+(2*T))*U))/2)+0.5)}}function C(){var T=new Animator({transition:S(),duration:500}).addSubject(new NumericalStyleSubject(k.elements.open,"right",10,13));T.play()}function G(){if(w.wiggleWait>0){window._hellobar_wiggleWaitTimer="";window._hellobar_wiggleWaitTimer=setInterval(function(){C()},w.wiggleWait)}}function a(U){var T=new Animator({transition:Animator.tx[w.transition],duration:w.speed,onComplete:function(){if(typeof(U)=="function"){U()}}}).addSubject(new NumericalStyleSubject(k.elements.open,"top",-96,-50));T.play()}function Q(){k.elements.open.style.top="-50px"}function i(U){var T=new Animator({transition:Animator.tx[w.transition],duration:w.speed,onComplete:function(){if(typeof(U)=="function"){U()}}}).addSubject(new NumericalStyleSubject(k.elements.open,"top",-50,-96));T.play()}function N(U){var T=new Animator({transition:Animator.tx[w.transition],duration:w.speed,onComplete:function(){U(k,w,"afterOpen")}}).addSubject(new NumericalStyleSubject(k.elements.wrapper,"height",0,(w.height+w.borderSize))).addSubject(new NumericalStyleSubject(k.elements.container,"top",(0-(w.height+w.borderSize+p)),0));if(w.positioning=="sticky"){T.addSubject(new NumericalStyleSubject(k.elements.pusher,"height",0,(w.height+w.borderSize)))}T.play()}function b(U){var T=new Animator({transition:Animator.tx.easeOut,duration:w.speed,onComplete:function(){U(k,w,"afterClose")}}).addSubject(new NumericalStyleSubject(k.elements.wrapper,"height",(w.height+w.borderSize),0)).addSubject(new NumericalStyleSubject(k.elements.container,"top",0,(0-(w.height+w.borderSize+p))));if(w.positioning=="sticky"){T.addSubject(new NumericalStyleSubject(k.elements.pusher,"height",(w.height+w.borderSize),0))}T.play()}function H(T){if(!T.match("^#")){T="#"+T}if(T.length==4){return"#"+T.substr(1,3)+T.substr(1,3)}return T}function l(T){return new RGBColor(T)}function c(T){if(T.match("^rgb")){return true}else{return false}}function u(T){var U=T.match(/((\d+)?\.?\d+)/g);return{r:U[0],g:U[1],b:U[2]}}function J(U){if(c(U)){rgb=u(U)}else{hex=H(U);rgb=l(hex)}if(rgb){var T=((rgb.r*299)+(rgb.g*587)+(rgb.b*114))/1000;if(T>125){return true}else{return false}}}function q(T){if(J(T)){w.imageStyle="dark-images"}else{w.imageStyle="light-images"}}function z(U){if(c(U)){rgb=u(U)}else{hex=H(U);rgb=l(hex)}if(J(U)){var T=38;return"rgb("+Math.min(rgb.r+T,255)+","+Math.min(rgb.g+T,255)+","+Math.min(rgb.b+T,255)+")"}else{var T=(0-38);return"rgb("+Math.max(rgb.r+T,0)+","+Math.max(rgb.g+T,0)+","+Math.max(rgb.b+T,0)+")"}var T=38;return"rgb("+Math.min(rgb.r+T,255)+","+Math.min(rgb.g+T,255)+","+Math.min(rgb.b+T,255)+")"}function x(){var T=Math.floor(new Date().getTime()/1000);return T}this.close=function(T){F(T);return false};this.open=function(T){v(T);clearTimeout(window._hellobar_wiggleWaitTimer);return false};function f(ad,Y,Z){k.message=ad;if(document.getElementById("hellobar-wrapper")){document.getElementById("hellobar-wrapper").parentNode.removeChild(document.getElementById("hellobar-wrapper"))}if(document.getElementById("hellobar-pusher")){document.getElementById("hellobar-pusher").parentNode.removeChild(document.getElementById("hellobar-pusher"))}clearTimeout(window._hellobar_showWaitTimer);clearTimeout(window._hellobar_hideAfterTimer);clearTimeout(window._hellobar_wiggleWaitTimer);var ab=document.cookie.match(/hellobar_current\=([0-9]+)/);if(ab){var aa=ab[1];if(parseInt(aa,10)!=parseInt(Z,10)){var ac=document.cookie.match(/hellobar_([0-9]+)_(variation|hide|shown)/g);for(var U in ac){var V=ac[U];n(V,0,true)}n("hellobar_current",0,true)}}n("hellobar_current",Z);K=x();for(var X in L){keyname=L[X];R[keyname]=[M,keyname].join("-")}for(var W in d){w[W]=d[W]}if(typeof(Y)!="undefined"){for(var W in Y){w[W]=Y[W]}}if(typeof(w.hideDestination)!="undefined"){if(w.hideDestination==1&&document.location.href==w.destinationUrl){return false}}if(w.forgetful===false){h()}else{G()}w.height=Math.max(w.height,O);if(w.height>O){w.texture=""}if(!document.getElementById(R.wrapper)){D();k.elements={};for(var X=0;X<L.length;X++){var T=L[X];k.elements[T]=document.getElementById(R[T])}document.getElementById(R.wrapper).hellobar=k;if(typeof(w.onReady)=="function"){w.onReady(k,w,"onReady")}}if(B===true&&j===true){k.elements.wrapper.style.display="block";k.elements.container.style.top="0px";k.elements.wrapper.style.height=(w.height+w.borderSize)+"px";if(w.positioning=="sticky"){k.elements.pusher.style.height=(0-(w.height+w.borderSize))+"px"}}k.elements.wrapper.style.display="block";if(B===true){if(k.elements.open){k.elements.open.style.top="-96px"}if(j!==true){if(w.showWait>0){if((w.showWait<w.hideAfter)||(w.hideAfter<0)){k.elements.container.style.top=(0-(w.height+w.borderSize+p))+"px";k.elements.wrapper.style.height="0px";if(w.positioning=="sticky"){k.elements.pusher.style.height="0px"}if(w.showTabInstantly){Q()}else{a()}o=k.isOpen=false}window._hellobar_showWaitTimer="";window._hellobar_showWaitTimer=setTimeout(function(){v()},w.showWait)}else{v()}}if(w.hideAfter>0){w.hideAfter=w.hideAfter+w.showWait;window._hellobar_hideAfterTimer="";window._hellobar_hideAfterTimer=setTimeout(function(){F()},w.hideAfter)}}else{k.elements.container.style.top=(0-(w.height+w.borderSize+p))+"px";k.elements.wrapper.style.height="0px";if(w.positioning=="sticky"){k.elements.pusher.style.height="0px"}a();o=k.isOpen=false;G()}}f(m,r,t)};function Animator(d){this.setOptions(d);var c=this;this.timerDelegate=function(){c.onTimerEvent()};this.subjects=[];this.state=this.target=0;this.lastTime=null}Animator.prototype={setOptions:function(b){this.options=Animator.applyDefaults({interval:20,duration:400,onComplete:function(){},onStep:function(){},transition:Animator.tx.easeInOut},b)},seekTo:function(b){this.seekFromTo(this.state,b)},seekFromTo:function(d,c){this.target=Math.max(0,Math.min(1,c));this.state=Math.max(0,Math.min(1,d));this.lastTime=(new Date).getTime();if(!this.intervalId){this.intervalId=window.setInterval(this.timerDelegate,this.options.interval)}},jumpTo:function(b){this.target=this.state=Math.max(0,Math.min(1,b));this.propagate()},toggle:function(){this.seekTo(1-this.target)},addSubject:function(b){this.subjects[this.subjects.length]=b;return this},clearSubjects:function(){this.subjects=[]},propagate:function(){for(var d=this.options.transition(this.state),c=0;c<this.subjects.length;c++){if(this.subjects[c].setState){this.subjects[c].setState(d)}else{this.subjects[c](d)}}},onTimerEvent:function(){var d=(new Date).getTime(),c=d-this.lastTime;this.lastTime=d;d=c/this.options.duration*(this.state<this.target?1:-1);Math.abs(d)>=Math.abs(this.state-this.target)?this.state=this.target:this.state+=d;try{this.propagate()}finally{this.options.onStep.call(this),this.target==this.state&&this.stop()}},stop:function(){if(this.intervalId){window.clearInterval(this.intervalId),this.intervalId=null,this.options.onComplete.call(this)}},play:function(){this.seekFromTo(0,1)},reverse:function(){this.seekFromTo(1,0)},inspect:function(){for(var d="#<Animator:\n",c=0;c<this.subjects.length;c++){d+=this.subjects[c].inspect()}d+=">";return d}};Animator.applyDefaults=function(f,e){var e=e||{},h,g={};for(h in f){g[h]=e[h]!==void 0?e[h]:f[h]}return g};Animator.makeArrayOfElements=function(e){if(e==null){return[]}if("string"==typeof e){return[document.getElementById(e)]}if(!e.length){return[e]}for(var d=[],f=0;f<e.length;f++){d[f]="string"==typeof e[f]?document.getElementById(e[f]):e[f]}return d};Animator.camelize=function(g){var f=g.split("-");if(f.length==1){return f[0]}for(var g=g.indexOf("-")==0?f[0].charAt(0).toUpperCase()+f[0].substring(1):f[0],j=1,i=f.length;j<i;j++){var h=f[j];g+=h.charAt(0).toUpperCase()+h.substring(1)}return g};Animator.apply=function(e,d,f){if(d instanceof Array){return(new Animator(f)).addSubject(new CSSStyleSubject(e,d[0],d[1]))}return(new Animator(f)).addSubject(new CSSStyleSubject(e,d))};Animator.makeEaseIn=function(b){return function(a){return Math.pow(a,b*2)}};Animator.makeEaseOut=function(b){return function(a){return 1-Math.pow(1-a,b*2)}};Animator.makeElastic=function(b){return function(a){a=Animator.tx.easeInOut(a);return(1-Math.cos(a*Math.PI*b))*(1-a)+a}};Animator.makeADSR=function(f,e,h,g){g==null&&(g=0.5);return function(a){if(a<f){return a/f}if(a<e){return 1-(a-f)/(e-f)*(1-g)}if(a<h){return g}return g*(1-(a-h)/(1-h))}};Animator.makeBounce=function(d){var c=Animator.makeElastic(d);return function(b){b=c(b);return b<=1?b:2-b}};Animator.tx={easeInOut:function(b){return -Math.cos(b*Math.PI)/2+0.5},linear:function(b){return b},easeIn:Animator.makeEaseIn(1.5),easeOut:Animator.makeEaseOut(1.5),strongEaseIn:Animator.makeEaseIn(2.5),strongEaseOut:Animator.makeEaseOut(2.5),elastic:Animator.makeElastic(1),veryElastic:Animator.makeElastic(3),bouncy:Animator.makeBounce(1),veryBouncy:Animator.makeBounce(3)};function NumericalStyleSubject(g,f,j,i,h){this.els=Animator.makeArrayOfElements(g);this.property=f=="opacity"&&window.ActiveXObject?"filter":Animator.camelize(f);this.from=parseFloat(j);this.to=parseFloat(i);this.units=h!=null?h:"px"}NumericalStyleSubject.prototype={setState:function(f){for(var f=this.getStyle(f),e=0,h=0;h<this.els.length;h++){try{this.els[h].style[this.property]=f}catch(g){if(this.property!="fontWeight"){throw g}}if(e++>20){break}}},getStyle:function(b){b=this.from+(this.to-this.from)*b;if(this.property=="filter"){return"alpha(opacity="+Math.round(b*100)+")"}if(this.property=="opacity"){return b}return Math.round(b)+this.units},inspect:function(){return"\t"+this.property+"("+this.from+this.units+" to "+this.to+this.units+")\n"}};function ColorStyleSubject(f,e,h,g){this.els=Animator.makeArrayOfElements(f);this.property=Animator.camelize(e);this.to=this.expandColor(g);this.from=this.expandColor(h);this.origFrom=h;this.origTo=g}ColorStyleSubject.prototype={expandColor:function(e){var d,f;if(d=ColorStyleSubject.parseColor(e)){return e=parseInt(d.slice(1,3),16),f=parseInt(d.slice(3,5),16),d=parseInt(d.slice(5,7),16),[e,f,d]}window.ANIMATOR_DEBUG&&alert("Invalid colour: '"+e+"'")},getValueForState:function(d,c){return Math.round(this.from[d]+(this.to[d]-this.from[d])*c)},setState:function(d){for(var d="#"+ColorStyleSubject.toColorPart(this.getValueForState(0,d))+ColorStyleSubject.toColorPart(this.getValueForState(1,d))+ColorStyleSubject.toColorPart(this.getValueForState(2,d)),c=0;c<this.els.length;c++){this.els[c].style[this.property]=d}},inspect:function(){return"\t"+this.property+"("+this.origFrom+" to "+this.origTo+")\n"}};ColorStyleSubject.parseColor=function(f){var e="#",h;if(h=ColorStyleSubject.parseColor.rgbRe.exec(f)){for(var g=1;g<=3;g++){f=Math.max(0,Math.min(255,parseInt(h[g]))),e+=ColorStyleSubject.toColorPart(f)}return e}if(h=ColorStyleSubject.parseColor.hexRe.exec(f)){if(h[1].length==3){for(g=0;g<3;g++){e+=h[1].charAt(g)+h[1].charAt(g)}return e}return"#"+h[1]}return !1};ColorStyleSubject.toColorPart=function(d){d>255&&(d=255);var c=d.toString(16);if(d<16){return"0"+c}return c};ColorStyleSubject.parseColor.rgbRe=/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;ColorStyleSubject.parseColor.hexRe=/^\#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;function DiscreteStyleSubject(g,f,j,i,h){this.els=Animator.makeArrayOfElements(g);this.property=Animator.camelize(f);this.from=j;this.to=i;this.threshold=h||0.5}DiscreteStyleSubject.prototype={setState:function(d){for(var c=0;c<this.els.length;c++){this.els[c].style[this.property]=d<=this.threshold?this.from:this.to}},inspect:function(){return"\t"+this.property+"("+this.from+" to "+this.to+" @ "+this.threshold+")\n"}};function CSSStyleSubject(t,s,r){t=Animator.makeArrayOfElements(t);this.subjects=[];if(t.length!=0){var q;if(r){s=this.parseStyle(s,t[0]),r=this.parseStyle(r,t[0])}else{for(q in r=this.parseStyle(s,t[0]),s={},r){s[q]=CSSStyleSubject.getStyle(t[0],q)}}for(q in s){s[q]==r[q]&&(delete s[q],delete r[q])}var p,o,m,k;for(q in s){var l=String(s[q]),n=String(r[q]);if(r[q]==null){window.ANIMATOR_DEBUG&&alert("No to style provided for '"+q+'"')}else{if(m=ColorStyleSubject.parseColor(l)){k=ColorStyleSubject.parseColor(n),o=ColorStyleSubject}else{if(l.match(CSSStyleSubject.numericalRe)&&n.match(CSSStyleSubject.numericalRe)){m=parseFloat(l),k=parseFloat(n),o=NumericalStyleSubject,p=CSSStyleSubject.numericalRe.exec(l),n=CSSStyleSubject.numericalRe.exec(n),p=p[1]!=null?p[1]:n[1]!=null?n[1]:n}else{if(l.match(CSSStyleSubject.discreteRe)&&n.match(CSSStyleSubject.discreteRe)){m=l,k=n,o=DiscreteStyleSubject,p=0}else{window.ANIMATOR_DEBUG&&alert("Unrecognised format for value of "+q+": '"+s[q]+"'");continue}}}this.subjects[this.subjects.length]=new o(t,q,m,k,p)}}}}CSSStyleSubject.prototype={parseStyle:function(i,g){var n={};if(i.indexOf(":")!=-1){for(var m=i.split(";"),l=0;l<m.length;l++){var k=CSSStyleSubject.ruleRe.exec(m[l]);k&&(n[k[1]]=k[2])}}else{var j;j=g.className;g.className=i;for(l=0;l<CSSStyleSubject.cssProperties.length;l++){m=CSSStyleSubject.cssProperties[l],k=CSSStyleSubject.getStyle(g,m),k!=null&&(n[m]=k)}g.className=j}return n},setState:function(d){for(var c=0;c<this.subjects.length;c++){this.subjects[c].setState(d)}},inspect:function(){for(var d="",c=0;c<this.subjects.length;c++){d+=this.subjects[c].inspect()}return d}};CSSStyleSubject.getStyle=function(e,d){var f;if(document.defaultView&&document.defaultView.getComputedStyle&&(f=document.defaultView.getComputedStyle(e,"").getPropertyValue(d))){return f}d=Animator.camelize(d);e.currentStyle&&(f=e.currentStyle[d]);return f||e.style[d]};CSSStyleSubject.ruleRe=/^\s*([a-zA-Z\-]+)\s*:\s*(\S(.+\S)?)\s*$/;CSSStyleSubject.numericalRe=/^-?\d+(?:\.\d+)?(%|[a-zA-Z]{2})?$/;CSSStyleSubject.discreteRe=/^\w+$/;CSSStyleSubject.cssProperties=["azimuth","background","background-attachment","background-color","background-image","background-position","background-repeat","border-collapse","border-color","border-spacing","border-style","border-top","border-top-color","border-right-color","border-bottom-color","border-left-color","border-top-style","border-right-style","border-bottom-style","border-left-style","border-top-width","border-right-width","border-bottom-width","border-left-width","border-width","bottom","clear","clip","color","content","cursor","direction","display","elevation","empty-cells","css-float","font","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","height","left","letter-spacing","line-height","list-style","list-style-image","list-style-position","list-style-type","margin","margin-top","margin-right","margin-bottom","margin-left","max-height","max-width","min-height","min-width","orphans","outline","outline-color","outline-style","outline-width","overflow","padding","padding-top","padding-right","padding-bottom","padding-left","pause","position","right","size","table-layout","text-align","text-decoration","text-indent","text-shadow","text-transform","top","vertical-align","visibility","white-space","width","word-spacing","z-index","opacity","outline-offset","overflow-x","overflow-y"];function AnimatorChain(e,d){this.animators=e;this.setOptions(d);for(var f=0;f<this.animators.length;f++){this.listenTo(this.animators[f])}this.forwards=!1;this.current=0}AnimatorChain.prototype={setOptions:function(b){this.options=Animator.applyDefaults({resetOnPlay:!0},b)},play:function(){this.forwards=!0;this.current=-1;if(this.options.resetOnPlay){for(var b=0;b<this.animators.length;b++){this.animators[b].jumpTo(0)}}this.advance()},reverse:function(){this.forwards=!1;this.current=this.animators.length;if(this.options.resetOnPlay){for(var b=0;b<this.animators.length;b++){this.animators[b].jumpTo(1)}}this.advance()},toggle:function(){this.forwards?this.seekTo(0):this.seekTo(1)},listenTo:function(e){var d=e.options.onComplete,f=this;e.options.onComplete=function(){d&&d.call(e);f.advance()}},advance:function(){this.forwards?this.animators[this.current+1]!=null&&(this.current++,this.animators[this.current].play()):this.animators[this.current-1]!=null&&(this.current--,this.animators[this.current].reverse())},seekTo:function(b){b<=0?(this.forwards=!1,this.animators[this.current].seekTo(0)):(this.forwards=!0,this.animators[this.current].seekTo(1))}};function RGBColor(g){this.ok=false;if(g.charAt(0)=="#"){g=g.substr(1,6)}g=g.replace(/ /g,"");g=g.toLowerCase();var a={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"};for(var c in a){if(g==c){g=a[c]}}var h=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(i){return[parseInt(i[1]),parseInt(i[2]),parseInt(i[3])]}},{re:/^(\w{2})(\w{2})(\w{2})$/,example:["#00ff00","336699"],process:function(i){return[parseInt(i[1],16),parseInt(i[2],16),parseInt(i[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(i){return[parseInt(i[1]+i[1],16),parseInt(i[2]+i[2],16),parseInt(i[3]+i[3],16)]}}];for(var b=0;b<h.length;b++){var e=h[b].re,d=h[b].process,f=e.exec(g);if(f){channels=d(f);this.r=channels[0];this.g=channels[1];this.b=channels[2];this.ok=true}}this.r=(this.r<0||isNaN(this.r))?0:((this.r>255)?255:this.r);this.g=(this.g<0||isNaN(this.g))?0:((this.g>255)?255:this.g);this.b=(this.b<0||isNaN(this.b))?0:((this.b>255)?255:this.b);this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"};this.toHex=function(){var k=this.r.toString(16),j=this.g.toString(16),i=this.b.toString(16);if(k.length==1){k="0"+k}if(j.length==1){j="0"+j}if(i.length==1){i="0"+i}return"#"+k+j+i};this.getHelpXML=function(){var m=new Array();for(var o=0;o<h.length;o++){var l=h[o].example;for(var n=0;n<l.length;n++){m[m.length]=l[n]}}for(var t in a){m[m.length]=t}var p=document.createElement("ul");p.setAttribute("id","rgbcolor-examples");for(var o=0;o<m.length;o++){try{var q=document.createElement("li"),s=new RGBColor(m[o]),u=document.createElement("div");u.style.cssText="margin: 3px; border: 1px solid black; background:"+s.toHex()+"; color:"+s.toHex();u.appendChild(document.createTextNode("test"));var k=document.createTextNode(" "+m[o]+" -> "+s.toRGB()+" -> "+s.toHex());q.appendChild(u);q.appendChild(k);p.appendChild(q)}catch(r){}}return p}};!function(t){"use strict";t.fn.fitVids=function(e){var i={customSelector:null,ignore:null};if(!document.getElementById("fit-vids-style")){var r=document.head||document.getElementsByTagName("head")[0],a=".fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}",d=document.createElement("div");d.innerHTML='<p>x</p><style id="fit-vids-style">'+a+"</style>",r.appendChild(d.childNodes[1])}return e&&t.extend(i,e),this.each(function(){var e=["iframe[src*='player.vimeo.com']","iframe[src*='youtube.com']","iframe[src*='youtube-nocookie.com']","iframe[src*='kickstarter.com'][src*='video.html']","object","embed"];i.customSelector&&e.push(i.customSelector);var r=".fitvidsignore";i.ignore&&(r=r+", "+i.ignore);var a=t(this).find(e.join(","));a=a.not("object object"),a=a.not(r),a.each(function(){var e=t(this);if(!(e.parents(r).length>0||"embed"===this.tagName.toLowerCase()&&e.parent("object").length||e.parent(".fluid-width-video-wrapper").length)){e.css("height")||e.css("width")||!isNaN(e.attr("height"))&&!isNaN(e.attr("width"))||(e.attr("height",9),e.attr("width",16));var i="object"===this.tagName.toLowerCase()||e.attr("height")&&!isNaN(parseInt(e.attr("height"),10))?parseInt(e.attr("height"),10):e.height(),a=isNaN(parseInt(e.attr("width"),10))?e.width():parseInt(e.attr("width"),10),d=i/a;if(!e.attr("id")){var o="fitvid"+Math.floor(999999*Math.random());e.attr("id",o)}e.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*d+"%"),e.removeAttr("height").removeAttr("width")}})})}}(window.jQuery||window.Zepto);