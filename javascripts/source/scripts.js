var App = {
  I18n: {
    _translations: {
      en: {
        Field18: "First name is required",
        Field19: "Last name is required",
        Field3: "Email is required",
        Field16: "Skype username or phone is required",
        Field5: "Message is required",
        Field41: "Project name is required",
        Field43: "First name is required",
        Field44: "Last name is required"
      },
      pt: {
        Field18: "Nome é obrigatório",
        Field19: "Sobrenome é obrigatório",
        Field3: "Email inválido",
        Field16: "Usuário no Skype ou telefone é obrigatório",
        Field5: "Resumo do projeto é obrigatório",
        Field41: "Nome do projeto é obrigatório",
        Field43: "Nome é obrigatório",
        Field44: "Sobrenome é obrigatório"
      }
    },
    defaultLocale: "pt",
    getCurrentLocale: function() {
      var locale = location.pathname.split('/')[1];
      if (this._translations.hasOwnProperty(locale)) {
        return locale;
      } else {

        return this.defaultLocale;
      }
    },
    t: function(field) {
      var currentLocale = this.getCurrentLocale();
      var translation = this._translations[currentLocale][field];
      if (translation) {
        return translation;
      } else {
        return "Missing translation for '" + field + "' with locale '" + currentLocale + "'";
      }
    }
  },
  StartApp: function() {
    BlogPosts.init();
    this.Work.init();
    this.CollapsePlugin();
    this.Modal();
    this.InterfaceActions();
    this.UserNavigation.init();
    this.testimonialHeight();
  },

  // dynamic testimonial height
  testimonialHeight: function(){
    var height = -1;
    $('.testimonials-list li').each(function() {
      height = Math.max($(this).height(), height);
    }).css('height', height + "px");

  },

  CollapsePlugin: function() {
    $.fn.collapsable = function(options) {
      // iterate and reformat each matched element
      return this.each(function() {
        // cache this:
        var obj = $(this);
        var tree = obj.next('.navigation');
        obj.click(function() {
          if (obj.is(':visible')) {
            tree.toggle();
          }
        });
        $(window).resize(function() {
          if ($(window).width() <= 570) {
            tree.attr('style', '');
          }
        });
      });
    }
  },

  // Collapse Plugin

  Modal: function() {

    var
      $modalBg = $("#modalBg"),
      $modalBox = $(".modalBox")
    ;

    $modalBox.append('<span class="modalClose">Fechar</span>');

    function EnableModal() {
      $('body').css({
        'overflow': 'hidden'
      });
      $modalBg.show();
    }

    function DisableModal() {
      $modalBg.fadeOut();
      $modalBox.fadeOut();
      $("body").css("overflow", "visible");
    }

    // Trigger 01
    $('.modalTrigger').click(function() {
      EnableModal();
      $(this).parent().parent().find('.modalBox').fadeIn();
    });

    // Trigger 02
    $('.m-det').click(function() {
      EnableModal();
      $(this).parent().find('.modalBox').fadeIn();
    });

    $modalBg.mouseup(function() {
      DisableModal();
    });

    $('.modalClose').click(function() {
      DisableModal();
    });

  }, // Modal
  UserNavigation: {
    init: function() {
      if (!window.sessionStorage) {
        return;
      }

      var userNavigation = this;

      $(function() {
        userNavigation.pushData(window.location.pathname);
        $('input[name=Field27]').val(userNavigation.getPaths().join('\n'));

        $('#talk-to-us').submit(function() {
          userNavigation.clear();
        });
      });
    },
    pushData: function(url) {
      var data = this.getPaths() || [];
      data.push(url);
      sessionStorage.setItem('user-navigation', JSON.stringify(data));
      return data;
    },
    clear: function() {
      sessionStorage.clear();
    },
    getPaths: function() {
      return JSON.parse(sessionStorage.getItem('user-navigation'));
    }
  },
  Work: {
    init: function() {
      this.calculateProjectCount();
    },
    calculateProjectCount: function() {
      var projectCount = $('#work-mvp ul li').size();
      $('[data-project-count]').text(projectCount);
    }
  },
  InterfaceActions: function() {

    // bottom_bar - advertise job vacancies
    var bottomBar = $("#bottom-bar");
    if(bottomBar){
      var flagShowBottomBar = "show_bottom_bar";
      var linkCloseBar = $("a.close-bar");

      new Date(localStorage.getItem(flagShowBottomBar)) < new Date() ? bottomBar.show() : bottomBar.fadeOut();

      linkCloseBar.click(function() {
        bottomBar.fadeOut(function(){
          var dateExpirate = new Date();
          dateExpirate.setDate(dateExpirate.getDate()+1);
          localStorage.setItem(flagShowBottomBar, dateExpirate);
        });
       });
    }

    // Eduardo's easter egg
    $("img[src='/images/time/time-eduardo.jpg']").hover(function() {
      $(this).attr("src", "/images/time/time-eduardo.gif");
      $(this).attr("srcset", "/images/time/time-eduardo.gif 2x");
    });

    $("#talk-to-us").validate({
      rules: {
        Field3: {
          required: true,
          email: true
        }
      },
      messages: {
        Field18: App.I18n.t('Field18'),
        Field19: App.I18n.t('Field19'),
        Field41: App.I18n.t('Field41'),
        Field43: App.I18n.t('Field43'),
        Field44: App.I18n.t('Field44'),
        Field3: App.I18n.t('Field3'),
        Field16: App.I18n.t('Field16'),
        Field5: App.I18n.t('Field5')
      }
    });

    /* Force refresh page and load image - bug fix firefox */
    $("a.languages, a#menu-time, a#menu-team, a.profile").click(function(event) { 
      event.preventDefault();
      window.location.href = $(this).attr("href");
 });

    $('#submit-btn').on('click',function(){
      $('#talk-to-us').submit();
      return false;
    });

    //
    $('.hide-content').addClass("hidden");

    $('.hide-content').click(function() {
      var $this = $(this);

      if ($this.hasClass("hidden")) {
        $(this).removeClass("hidden").addClass("visible");

      } else {
        $(this).removeClass("visible").addClass("hidden");
      }
    });

    /* Menu: Current Page */

    var current_page = location.pathname;

    $("#menu2 a").each(function(i) {
      if (current_page.indexOf($(this).attr('href')) == 0) {
        $(this).addClass('current-page');
        return false
      }
    });


    /* Menu: Mobile */

    $("#menu-trigger").click(function() {
      $("#menu2").toggle();
    });

    $('.slide-trigger').collapsable();


    /* PrettyPhoto */

    $("a[rel^='prettyPhoto']").prettyPhoto({
      deeplinking: false,
      changepicturecallback: function() {
        var viewportWidth = $('body').innerWidth();
        if (viewportWidth < 1025) {
          $(".pp_pic_holder.pp_default").css("top", window.pageYOffset + "px");
        }
      }
    });


    /* Work cycle */
    var t = {
      $el: $("#carousel-slider .slideshow"),
      clickImage: function (e) {
        var t = $(e.target),
            n = t.index(),
            i = t.parent().find(".cycle-slide-active").index();
        return this.cycle(n == i ? "prev" : "next"), !1
      },
      makeFirstSlideCentered: function () {
          this.$el.prepend(this.$el.find("img:last").remove())
      },
      init: function () {
          this.makeFirstSlideCentered(), this.$el.cycle({
            fx: "carousel",
            paused: !0,
            carouselVisible: 3,
            carouselFluid: !0,
            swipe: !0,
            next: '#carousel-slider-next',
            prev: '#carousel-slider-prev'
          }), this.$el.on("click", "img", $.proxy(this.clickImage, this.$el)).find("img").css("opacity", "")
      }
    };
    t.init();


    /* Services */

    $(".services h3").click(function() {
      $(this).parent().find(".service-entry").toggle();
    });

    $(".service-01 a").click(function() {
      $(".service-01").find(".service-entry").hide();
      $(".service-02").find(".service-entry").show();
    });

    $(".service-02 a").click(function() {
      $(".service-02").find(".service-entry").hide();
      $(".service-03").find(".service-entry").show();
    });

    $(".service-03 a").click(function() {
      $(".service-03").find(".service-entry").hide();
      $(".service-04").find(".service-entry").show();
    });

    $(".service-04 a").click(function() {
      $(".service-04").find(".service-entry").hide();
      $(".service-05").find(".service-entry").show();
    });

    $(".service-05 a").click(function() {
      $(".service-05").find(".service-entry").hide();
      $(".service-06").find(".service-entry").show();
    });

    $(".service-06 a").click(function() {
      $(".service-06").find(".service-entry").hide();
      $(".service-07").find(".service-entry").show();
    });

    $(".service-07 a").click(function() {
      $(".service-07").find(".service-entry").hide();
      $(".service-08").find(".service-entry").show();
    });


    /* External Links */

    $("a[rel^='external']").each(function() {
      $(this).attr("target", "_blank");
    });


    /* Animated header */

    if(document.body.offsetWidth >= 686) {
       $(window).on("scroll touchmove", function() {
         $('header.default').toggleClass('tiny', $(document).scrollTop() > 0);
       });
     }


    /* General */

    $('nav, .advice, header, #right, #single-page').localScroll({
      duration: 1000,
      axis: 'y'
    });

    $('#process-info').localScroll({
      duration: 1000,
      axis: 'y',
      hash: true
    });

    $(window).scroll(function() {
      if ($(window).width() > 960) {
        var posX = $(window).scrollTop() - ($(window).scrollTop() * 40 / 100) + "px";
        $("#home").css({
          backgroundPosition: "50% " + posX
        });
      }
    });

    if ($("section#cloud").size() > 0) {

      var
      $slider = $("ul.step-list"),
        i = 1;

      function changeActive() {
        $("ul.nav-slider a").removeClass("active").eq(i - 1).addClass("active");
      }

      function animateSlider(index) {
        $slider.animate({
          left: "-" + 930 * i + "px"
        }, 1000);
      }

      $("ul.nav-slider li").click(function(e) {
        e.preventDefault();
        i = $(this).index();
        animateSlider(i);
        i = $(this).index() + 1;
        changeActive();
      });

      $("#next").click(function(e) {
        e.preventDefault();
        if (i <= 2) {
          i++;
          $slider.animate({
            left: "-=930px"
          }, 1000);
        } else {
          i = 1;
          $slider.animate({
            left: "0px"
          }, 1000);
        }

        changeActive();
      });

      $("#prev").click(function(e) {
        e.preventDefault();
        if (i > 1) {
          $slider.animate({
            left: "+=930px"
          }, 1000);
          i--;
        } else if (i <= 1) {
          $slider.animate({
            left: "-=" + 930 * 2 + "px"
          }, 1000);
          i = 5;
        }
        changeActive();
      });
    }

    if ($("section#cliente").size() > 0) {

      var
        link = $(".js-client-videos-chooser a"),
        iframe = $(".js-client-videos iframe")
      ;

      iframe.hide();
      iframe.eq(0).show();

      link.eq(0).addClass("selected");
      link.click(function(e) {
        var clicked = $(this).index();
        link.removeClass("selected");
        $(this).addClass("selected");
        iframe.hide();
        iframe.eq(clicked).show();
        e.preventDefault();
      });
    }


    $('#work-mvp').prepend('<a class="more" href="">&raquo;</a>');

    $('#work-mvp .more').on('click', function(e) {
      e.preventDefault();

      $(this).parent().toggleClass('expanded');

      $('html, body').stop().animate({
        'scrollTop': $('#work-mvp').offset().top
      }, 900, 'swing');
    });

  }


} // Var Site

BlogPosts = {};

BlogPosts.init = function () {
  if (location.pathname === "/pt/" || location.pathname === "/en/") {
    this.container = '.our-blog .blog-containner';
    this.template = Handlebars.compile($('#blog-posts').hide().html());
    $(this.container).addClass("loading");
    this.render();
  };
};

BlogPosts.fetch = function() {
  function twoPlaces(number) {
    return ('0' + number).slice(-2);
  }
  function formatDate(date) {
    return twoPlaces(date.getDate()) + '/' +
      twoPlaces(date.getMonth() + 1) + '/' +
      date.getFullYear();
  }
  function normalizeToJson(atom) {
    return $(atom).find('entry').map(function() {
      var $entry = $(this);
      return {
        title: $entry.find('title').text(),
        url: $entry.find('id').text(),
        author: $entry.find('author name').text(),
        date: formatDate(new Date($entry.find('updated').text()))
      }
    }).toArray();
  }
  return $.get('/blog/atom-lite.xml').then(normalizeToJson);
};

function createBlogSlider ($container) {
  var blogslider = $container.bxSlider(getBxSliderData());

  $(window).resize(function() {
    blogslider.reloadSlider(getBxSliderData());
  });

  function getBxSliderData () {
    return ({
      mode: ($(window).width() < 960) ? "vertical" : "horizontal",
      minSlides: 3,
      maxSlides: 3,
      slideWidth: ($(window).width() < 960) ? 0 : 5000,
      infiniteLoop: true,
      auto: true,
      pause: 5000,
      autoHover: true,
      controls: false,
      slideMargin: 25
    });
  }
}

BlogPosts.render = function () {
  var template = this.template;
  var $container = $(this.container);

  this.fetch().then(function(posts) {
    $container.append(template({ posts: posts.slice(0, 9) })).removeClass("loading");
    createBlogSlider($container);
  });
}

InstantClick.on('change', function() {
  if (typeof ga !== 'undefined') {
    ga('send', 'pageview');
  }
  if (typeof(CE2) !== "undefined") {
    CE2.userMain();
  }

  $(function() {
    App.StartApp();
  });
});

InstantClick.init();


