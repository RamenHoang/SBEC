var table = $('#sbec-products-table').DataTable();

// get full product to client
// $.get('#', function (data, status) {
//     updateProductDataTable(data);
// });

updateProductDataTable({
    id: 123,
    name: 'Product 1',
    price: 1500,
    color: 'yellow',
    material: 'Woods',
    type: 'Chair',
    brand: 'Home4You'
})

function updateProductDataTable(products) {
    table
        .clear()
        .rows.add([
            [
                '<img src="../images/products/product.jpg" width="100">',
                '123',
                'Product 1',
                '1500',
                'yellow',
                'Woods',
                'Chair',
                'Home4You'
            ]
        ])
        .draw();
}