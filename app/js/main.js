$(function(){
    var $news = $('.news'),
        $view = $news.find('.news__view'),
        $buttonOpen = $news.find('.news__aside'),
        $bottonClose = $view.find('.glyphicon-remove_news__view');

    $buttonOpen.on('click', function () {
        var $this = $(this);

        $this.next($view).fadeIn();
    });

    $bottonClose.on('click', function () {
        var $this = $(this);

        $this.closest($view).fadeOut();
    });
});