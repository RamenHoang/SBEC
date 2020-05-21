$(document).ready(function () {
    let $xRangeBar = $('#x-range');
    let $yRangeBar = $('#y-range');
    let $zRangeBar = $('#z-range');
    let $rRangeBar = $('#r-range');
    let $productInSideBg = $('.sbec-background-product__product');
    let $bg = $('.sbec-background-product__background');

    initAjustingBar($bg.height());
    initBackgroundOfProduct();
    console.log($bg.width());
    $xRangeBar.on('input', function () {
        $productInSideBg.css('left', $xRangeBar.val() + '%');
        console.log($xRangeBar.val());
    });
    $yRangeBar.on('input', function () {
        $productInSideBg.css('top', $yRangeBar.val() + '%');
    });
    $zRangeBar.on('input', function () {
        $productInSideBg.css('transform', `translate(-50%,-50%) scale(${$zRangeBar.val() / 50.0}) rotate(${$rRangeBar.val() * 3.6}deg)`);
    });
    $rRangeBar.on('input', function () {
        $productInSideBg.css('transform', `translate(-50%,-50%) scale(${$zRangeBar.val() / 50.0}) rotate(${$rRangeBar.val() * 3.6}deg)`);
    });

    // change image when click on product card
    let $productCard = $('.sbec-product-card__image');

    $productCard.parent().on('click', function () {
        let $currentImg = $(this).children('.sbec-product-card__image').children('img');
        $('.sbec-background-product__product').attr('src', $currentImg.attr('src'));
        console.log($('.sbec-background-product__product').attr('src'));
        console.log('src:' + $currentImg.attr('src'));
    });

    // Handle upload background product
    let $customFileInput = $('.custom-file-input');
    let currentFileInput = undefined;
    $customFileInput.on('change', function () {
        let fileName = $(this).val().split("\\").pop();
        $(this).siblings('.custom-file-label').addClass('selected').text(fileName);

        currentFileInput = this;
    });

    // apply image and ajist y and z bar
    $('#apply-background').click(function () {
        if (currentFileInput != undefined) {
            let fileReader = new FileReader();
            fileReader.onload = function (e) {
                sessionStorage.setItem('background-product', e.target.result);
                $bg.attr('src', e.target.result);
                setTimeout(function(){
                    initBackgroundOfProduct();
                },100);
            }
            fileReader.readAsDataURL(currentFileInput.files[0]);
            $('.modal').modal('hide');
        }
    });

    function initBackgroundOfProduct() {
        let dataBg = sessionStorage.getItem('background-product');
        if (dataBg != null) {
            $bg.attr('src', dataBg);
            setTimeout(initAjustingBar($bg.height()),100);
        }
    }
});
function initAjustingBar(bgHeight) {
    console.log(bgHeight);
    $('#y-range').css('width', bgHeight + 'px');
    $('#y-range').css('left', -bgHeight / 2 - 10 + 'px');
    $('#z-range').css('width', bgHeight + 'px');
    $('#z-range').css('right', -bgHeight / 2 - 10 + 'px');
}