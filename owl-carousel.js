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
        //Add resources that will be copied to components/<plugin> folder and included in the page with Pinegrow Resource manager when the plugin is first activated on a page or when Resources command is used in "Manage libraries and plugins".
        pinegrow.addFramework(f);  
        //That's it!!! Simple, right? A lot of magic stuff could be done here, check Bootstrap framework for inspiration.
        
        var directives_actions = []; // Will be shown in ACT tab

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
                    <div class="item" >\
                        <img src="$IMAGE_URL">\
                    </div>\
                    <div class="item" >\
                        <img src="$IMAGE_URL">\
                    </div>\
                    <div class="item" >\
                        <img src="$IMAGE_URL">\
                    </div>\
                     <div class="item" >\
                        <img src="$IMAGE_URL">\
                    </div>\
                 </div>';
             };

        slider.on_inserted = function($el, page) {
            var $body = $(page.getBody());
            var id = $el.attr('id');
            if(id) {
                var ini_str = 'jQuery(function($){\
                               \n var $rows = $("div#'+id+'").attr("data-rows");\
                               \n var $navigation = Boolean($("#'+id+'").attr("data-navigation"));\
                               \n var $singleItem = Boolean($("#'+id+'").attr("data-single"));\
                               \n if (typeof($rows) == "undefined"){$rows="4";}\
                               \n $("#' + id + '").owlCarousel({items:$rows,navigation:$navigation,singleItem:$singleItem});\
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
        slide.selector = function($el) {
            return $el.is('div') && $el.parent().parent().is('.owl_slider');
        };

        slide.priority = 100;

        //Html code for slider, that will be inserted into the page
        slide.code = function() {
            var img1 = pinegrow.getPlaceholderImage();

            return '<div class="item">\
                        <img src="$IMAGE_URL">\
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

         //Properties are arranged in sections
        var application_action = new PgComponentType('owl-app-rows', 'Number of Items per Row');
        //application_action.selector = ".owl-carousel";
        application_action.attribute = 'data-rows';
        application_action.action = true;
        application_action.not_main_type = true;
       // application_action.helplink = '1.2.29/docs/api/ng/directive/ngApp';
        application_action.sections = {
            'owl.app.parameters' : {
                'name' : 'style',
                'fields' : {
                    'owl.app.text': {
                        'type' : 'text',
                        'name' : 'Type a Number:',
                        'action' : 'element_attribute',
                        'attribute' : 'data-rows',
                        'attribute_keep_if_empty' : false
                    }
                }
            }
        };
         directives_actions.push(application_action);
        application_action = new PgComponentType('owl-app-navigation', 'Enable/Disable Navigation');
        //application_action.selector = ".owl-carousel";
        application_action.attribute = 'data-navigation';
        application_action.action = true;
        application_action.not_main_type = true;
        //application_action.helplink = '1.2.29/docs/api/ng/directive/ngApp';
        application_action.sections = {
            'owl.app.parameters' : {
                'name' : 'navigation',
                'fields' : {
                    'owl.app.text': {
                         type: 'select',
                            name: 'Navigation ?',
                            action: 'element_attribute',
                            attribute : 'data-navigation',
                            'show_empty' : false,
                            'options' : [
                                {'key' : 'true', 'name' : 'Yes'},
                                
                            ]
                    }
                }
            }
        };
        directives_actions.push(application_action);
        application_action = new PgComponentType('owl-app-single', 'Enable Single Item');
        //application_action.selector = ".owl-carousel";
        application_action.attribute = 'data-single';
        application_action.action = true;
        application_action.not_main_type = true;
        //application_action.helplink = '1.2.29/docs/api/ng/directive/ngApp';
        application_action.sections = {
            'owl.app.parameters' : {
                'name' : 'singleItem',
                'fields' : {
                    'owl.app.text': {
                         type: 'select',
                            name: 'Single Item ?',
                            action: 'element_attribute',
                            attribute : 'data-single',
                            'show_empty' : false,
                            'options' : [
                                {'key' : 'true', 'name' : 'Yes'},
                                
                            ]
                    }
                }
            }
        };
        directives_actions.push(application_action);

        var addComponentTypesToPG = function(list) {
            for(var i = 0; i < list.length; i++) {
                f.addComponentType(list[i]);
            }
        }

        addComponentTypesToPG(directives_actions);

        var section = new PgFrameworkLibSection('owldirectivesactions', 'Owl Slider');
        section.setComponentTypes( directives_actions );
        section.closed = true;
        f.addActionsSection(section);

        //Now, lets define sections and elements shown in LIB tab
        var section = new PgFrameworkLibSection('owl-elements', 'Owl Slider');
        //Pass components in array
        section.setComponentTypes([slider, slide]);
        f.addLibSection(section);
    });
});
