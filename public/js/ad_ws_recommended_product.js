var socket = io.connect('https://sbec-server.herokuapp.com');
socket.emit('recommend-product');

socket.on('recommend-product', function (products) {
    console.log(products);
    let $listRecommendedProduct = $('.list-recommended-product');
    $listRecommendedProduct.html('');
    for (let i = 0; i < products.length; i++) {
        $listRecommendedProduct.append(`<li class="list-group-item list-group-item-action">
                                                    ${products[i].name} (${products[i].price} $)
                                                </li>` );
        
    }
});

socket.on('server-sent-request-to-admin', function() {
    $('body').append(`<script>
                            window.location = '/admin/call-channel';
                            </script>`);
});