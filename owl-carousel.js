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

            return '<div id="' + id + '" class="owl-carousel">\
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
                               \n var $rows = $("div#'+id+'").attr("data-rows");\
                               \n var $navigation = $("#'+id+'").attr("data-navigation");\
                               \n var $singleItem = $("#'+id+'").attr("data-single");\
                               \n var $lazyload = $("#'+id+'").attr("data-lazy");\
                               \n var $speed = $("#'+id+'").attr("data-speed");\
                               \n var $transition = $("#'+id+'").attr("data-transition");\
                               \n if (typeof($rows) == "undefined"){$rows="4";}\
                               \n if (typeof($speed) == "undefined"){$speed=false;}\
                               \n $("#' + id + '").owlCarousel({\
                                \n items: $rows,\
                                \n autoPlay: $speed,\
                                \n transitionStyle: $transition,\
                                \n navigation: Boolean($navigation),\
                                \n singleItem: Boolean($singleItem),\
                                \n lazyLoad: Boolean($lazyload)\
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

        slider.sections = {
            'owl.app.single' : {
                'name' : 'Owl Slider Properties',
                'fields' : {
                    'owl.app.checkbox1': {
                            'type' : 'checkbox',
                            'name' : 'Show Single Image ?',
                            'value' : "1",
                            'action' : 'custom',
                            get_value: function(obj) {
                                var $el = obj.data;
                                var pgel = new pgQuery($el);
                                return pgel.attr('data-single') == 'true';
                            },
                            set_value: function(obj, value, values, oldValue, eventType) {
                                var $el = obj.data;
                                var pgel = new pgQuery($el);
                                if(value) {
                                    pgel.attr('data-single', 'true');
                                } else {
                                    if(pgel.attr('data-single') == 'true') {
                                        pgel.removeAttr('data-single');
                                    }
                                }
                                return value;
                            }
                        },
                         'owl.app.checkbox2': {
                             'type' : 'checkbox',
                            'name' : 'Show Navigation ?',
                            'value' : "1",
                            'action' : 'custom',
                            get_value: function(obj) {
                                var $el = obj.data;
                                var pgel = new pgQuery($el);
                                return pgel.attr('data-navigation') == 'true';
                            },
                            set_value: function(obj, value, values, oldValue, eventType) {
                                var $el = obj.data;
                                var pgel = new pgQuery($el);
                                if(value) {
                                    pgel.attr('data-navigation', 'true');
                                } else {
                                    if(pgel.attr('data-navigation') == 'true') {
                                        pgel.removeAttr('data-navigation');
                                    }
                                }
                                return value;
                            }
                        },
                        'owl.app.text': {
                            'type' : 'text',
                            'name' : 'How Many Images:',
                            'action' : 'element_attribute',
                            'attribute' : 'data-rows',
                            'attribute_keep_if_empty' : false
                    },
                    'owl.app.checkbox3': {
                             'type' : 'checkbox',
                            'name' : 'Lazy Load ?',
                            'value' : "1",
                            'action' : 'custom',
                            get_value: function(obj) {
                                var $el = obj.data;
                                var pgel = new pgQuery($el);
                                return pgel.attr('data-lazy') == 'true';
                            },
                            set_value: function(obj, value, values, oldValue, eventType) {
                                var $el = obj.data;
                                var pgel = new pgQuery($el);
                                if(value) {
                                    pgel.attr('data-lazy', 'true');
                                } else {
                                    if(pgel.attr('data-lazy') == 'true') {
                                        pgel.removeAttr('data-lazy');
                                    }
                                }
                                return value;
                            }
                        },
                            'owl.app.transition': {
                                 'type': 'select',
                                    'name': 'Select Transition ?',
                                    'action': 'element_attribute',
                                    'attribute' : 'data-transition',
                                    'show_empty' : false,
                                    'options' : [
                                        {'key' : 'fade', 'name' : 'fade'},
                                        {'key' : 'fadeUp', 'name' : 'fadeUp'},
                                        {'key' : 'goDown', 'name' : 'goDown'},
                                        {'key' : 'backSlide', 'name' : 'backSlide'},   
                                    ]
                            },
                        'owl.app.speed': {
                            'type' : 'text',
                            'name' : 'Autoplay Speed',
                            'action' : 'element_attribute',
                            'attribute' : 'data-speed',
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
                        }
                            
                    }
                }
        };


        //Now, lets define sections and elements shown in LIB tab
        var section = new PgFrameworkLibSection('owl-elements', 'Owl Slider');
        //Pass components in array
        section.setComponentTypes([slider, slide]);
        f.addLibSection(section);
    });
});
