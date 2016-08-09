/*
Created by itsmeleo for Pinegrow Web Editor
Licensed under MIT license
Feel free to use the code in your own Pinegrow
*/
$(function() {

    //Wait for Pinegrow to wake-up
    $('body').one('pinegrow-ready', function(e, pinegrow) {

        //Create new Pinegrow framework object
        var f = new PgFramework('js.owl', 'OWL Carousel and Slider');

        //This will prevent activating multiple versions of 960 grid framework, provided that other versions set the same type
        f.type = "js.owl";
        f.allow_single_type = true;
        //Tell Pinegrow about the framework and loads necessary plugins
         f.detect = function(pgPage) {
            return pgPage.hasScript(/(^|\/)owl.*\.js/i); //detect just if OWL is already on the page
        }
        //Tell Pinegrow about the framework
        pinegrow.addFramework(f);

        //Add properties common to all components of this framework
       
        //Owl Slider
        //==================
        var slider = new PgComponentType('owl-carousel-slider', 'OWL Slider');

        //How can we identify DOM elements that are sliders?
        slider.selector = ".owl-carousel";
        
        //Html code for slider, that will be inserted into the page
        slider.code = function() {
            var id = pinegrow.getUniqueId('owl_slider');

            return '<div id="' + id + '" class="owl-carousel" data-parameters=" items:4,nav:true,animateOut:\'fadeOut\',animateIn:\'fadeIn\'">\
                    <div class="item " >\
                        <img src="$IMAGE_URL" class="lazyOwl">\
                    </div>\
                    <div class="item"  >\
                        <img src="$IMAGE_URL" class="lazyOwl">\
                    </div>\
                    <div class="item" >\
                        <img src="$IMAGE_URL" class="lazyOwl">\
                    </div>\
                     <div class="item" >\
                        <img src="$IMAGE_URL" class="lazyOwl">\
                    </div>\
                 </div>';
             };

        slider.on_inserted = function($el, page) {
            var $body = $(page.getBody());
            var id = $el.attr('id');
            if(id) {
                var ini_str = 'jQuery(function($){\
                               \n var $parameters = $("div#'+id+'").attr("data-parameters");\
                               \n var $obj = eval("({" + $parameters + "})");\
                               \n $("#' + id + '").owlCarousel({\
                                \n    items: $obj.items,\
                                \n    nav: $obj.nav,\
                                \n    animateOut: $obj.animateOut,\
                                \n    animateIn: $obj.animateIn,\
                                \n    margin: 10\
                                \n });\
                               \n });';
                pinegrow.addScriptToPage(page, ini_str);
                pinegrow.showNotice('<p>OWL slider initialization Javascript was appended to the end of the page:</p><pre>' + escapeHtmlCode(ini_str) + '</pre><p>If you change the #id of the slider element you\'ll need to update the selector in this code. You also need to <b>include OWL slider Javascript</b> to the page.</p>', 'OWL Slider inserted', 'owl-on-inserted');
            }
        }
     //Set empty_placeholder to true so that empty container gets min-height set. Otherwise empty container would be invisible. This lets us see it and use it as drop target. Placeholder style gets removed as soon as we add something to this element.
        slider.empty_placeholder = false;

        //Highlight element in the tree to show it is important and has special features
        slider.tags = 'major';

        //Add it to our framework
        f.addComponentType(slider);

        //Slider
        //==================
        var slide = new PgComponentType('Owl-Slide', 'Slide');

        //How can we identify DOM elements that are sliders?
        /*slide.selector = function($el) {
            return $el.is('div') && $el.parent().parent().is('.owl-carousel');
        };*/
         slide.selector = ".lazyOwl";
        slide.priority = 100;

        //Html code for slider, that will be inserted into the page
        slide.code = function() {
            var img1 = pinegrow.getPlaceholderImage();

            return '<div class="item lazyOwl">\
                        <img src="$IMAGE_URL" class="lazyOwl">\
                    </div>';
        };

        //Highlight element in the tree to show it is important and has special features
        slide.tags = 'major';

        //Add it to our framework
        f.addComponentType(slide);

        //Add Video slider to the owl carousel

        var video = new PgComponentType('Owl-Slide-video', 'Video');

        //How can we identify DOM elements that are sliders?
        /*slide.selector = function($el) {
            return $el.is('div') && $el.parent().parent().is('.owl-carousel');
        };*/
         video.selector = ".owl-video";
        video.priority = 200;

        //Html code for slider, that will be inserted into the page
        video.code = function() {
            return '<div class="item-video">\
                        <a class="owl-video" href="https://www.youtube.com/watch?v=bZ1aQ1AG9og"></a>\
                    </div>';
        };

        //Highlight element in the tree to show it is important and has special features
        video.tags = 'major';

        //Add it to our framework
        f.addComponentType(video);


        var r = new PgComponentTypeResource(f.getResourceFile('./assets/owl.carousel.min.js')); //relative to plugin js file
        r.relative_url = 'js/owl.carousel.min.js'; //what should the relative url be when resource is used on the page
        r.source = crsaMakeFileFromUrl(r.url);
        r.footer = true; //Recommended for JS files.
        f.resources.add(r);

        r = new PgComponentTypeResource(f.getResourceFile('./assets/owl.carousel.css'));
        r.relative_url = 'css/owl.carousel.css';
        r.source = crsaMakeFileFromUrl(r.url);
        r.footer = false;
        f.resources.add(r);

        r = new PgComponentTypeResource(f.getResourceFile('./assets/owl.theme.css'));
        r.relative_url = 'css/owl.theme.css';
        r.source = crsaMakeFileFromUrl(r.url);
        r.footer = false;
        f.resources.add(r);

        r = new PgComponentTypeResource(f.getResourceFile('./assets/owl.transitions.css'));
        r.relative_url = 'css/owl.transitions.css';
        r.source = crsaMakeFileFromUrl(r.url);
        r.footer = false;
        f.resources.add(r);

        r = new PgComponentTypeResource(f.getResourceFile('./assets/animate.css'));
        r.relative_url = 'css/animate.css';
        r.source = crsaMakeFileFromUrl(r.url);
        r.footer = false;
        f.resources.add(r);

        r = new PgComponentTypeResource(f.getResourceFile('./assets/grabbing.png'));
        r.relative_url = 'css/grabbing.png';
        r.source = crsaMakeFileFromUrl(r.url);
        r.footer = false;
        f.resources.add(r);

        r = new PgComponentTypeResource(f.getResourceFile('./assets/AjaxLoader.gif'));
        r.relative_url = 'css/AjaxLoader.gif';
        r.source = crsaMakeFileFromUrl(r.url);
        r.footer = false;
        f.resources.add(r);

        r = new PgComponentTypeResource(f.getResourceFile('./assets/owl.video.play.png'));
        r.relative_url = 'css/owl.video.play.png';
        r.source = crsaMakeFileFromUrl(r.url);
        r.footer = false;
        f.resources.add(r);

        slider.sections = {
            'owl.app.single' : {
                'name' : 'Owl Slider Properties',
                'fields' : {
                        'owl.app.parameters': {
                            'type' : 'text',
                            'name' : 'Parameters',
                            'action' : 'element_attribute',
                            'attribute' : 'data-parameters',
                             'placeholder': 'Default: items:4,nav:true,animateIn: fadeIn, animateOut: fadeOut',
                            'attribute_keep_if_empty' : false
                    }
                        
                    }
            }
        };
        slide.sections = {
            'owl.app.lazyimg' : {
                'name' : 'Owl Slide',
                'fields' : {
                        'owl.app.lazyimg': {
                            'type' : 'image',
                            'name' : 'Lazy Load Image Path',
                            'action' : 'element_attribute',
                            'attribute' : 'data-src',
                            'attribute_keep_if_empty' : false
                        },
                            
                    }
                }
        };
           video.sections = {
            'owl.app.video' : {
                'name' : 'Owl Video',
                'fields' : {
                        'owl.app.video': {
                            'type' : 'image',
                            'name' : 'url',
                            'action' : 'element_attribute',
                            'attribute' : 'href',
                            'attribute_keep_if_empty' : false
                        },
                            
                    }
                }
        };


        //Now, lets define sections and elements shown in LIB tab
        var section = new PgFrameworkLibSection('owl-elements', 'Owl Slider');
        //Pass components in array
        section.setComponentTypes([slider, slide, video]);
        f.addLibSection(section);
    });
});
