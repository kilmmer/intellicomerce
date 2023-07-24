const getProducts = async (term = '') => {
    const result = await (await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=32' + (term !== '' ? '&title=' + term : ''))).json()
    return result
}

const mountListProducts = async (products) => {
    const listProducts = document.querySelector("#list-products")

    let dom = ''

    dom += `
            <div class="row">`
    products.forEach(item => {

        dom += `<div class="col-3 mb-4">
                <div class="card">
                    <div class="d-flex overflow-hidden justify-content-center align-content-center m-auto pt-3" style="max-width: 250px; max-height: 270px;">
                        <img src="${item.images[0]}" class="img-fluid" alt="${item.title}">
                    </div>
                    <hr />
                    <div class="card-body overflow-hidden h-50 text-center">
                        <h5 class="card-title text-truncate">${item.title}</h5>
                        <p class="card-text text-truncate">${item.description}</p>
                        <a href="#" class="btn btn-primary" onclick="closeModal()">Ver produto</a>
                    </div>
                </div>
            </div>`
    })
    dom += `
            </div>`

    listProducts.innerHTML = dom
    listProducts.classList.remove("d-none")
    document.querySelector('.btnmore').classList.remove('d-none')

    return products
}

const modalProductFn = new bootstrap.Modal('#modalProduct', {
    keyboard: false
})

const modalProduct = (id) => {
    const products = JSON.parse(localStorage.getItem('products'))
    modalProductFn.show()

}

const closeModal = () => {
    modalProductFn.close()
}

const sortProducts = async () => {
    const products = JSON.parse(localStorage.getItem('products'))

    function randomSort(a, b) {
        return Math.random() - 0.5;
    }

    products.sort(randomSort)

    await mountListProducts(products)

}

function Intervalo(fn, intervalo) {
    let timerId; // armazena o ID do intervalo

    this.ativar = function () {
        if (!timerId) {
            fn(); // executa a função imediatamente
            timerId = setInterval(fn, intervalo); // inicia o intervalo
            console.log('started')
        }
    };

    this.desativar = function () {
        console.log('stopped')

        if (timerId) {
            clearInterval(timerId); // limpa o intervalo
            timerId = null;
        }
    };
}

const stateRandomProducts = (state) => {
    const randomProducts = new Intervalo(sortProducts, 5000)
    if (state) {
        randomProducts.ativar()
    } else {
        console.log(state)
        randomProducts.desativar()
    }
}

const searchProduct = async ($event) => {
    const term = $event.target[0].value
    console.log(term)
    const result = await getProducts(term)
    await mountListProducts(result)
}

window.onload = async () => {
    const listProducts = await getProducts()
    await mountListProducts(listProducts)
    localStorage.setItem('products', JSON.stringify(listProducts))
    // stateRandomProducts(true)
    document.querySelector('input#showRandomly').addEventListener('change', $event => {

        const { checked } = $event.target

        stateRandomProducts(checked)
    })

}



