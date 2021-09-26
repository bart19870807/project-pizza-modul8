/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

// const { utils } = require('stylelint');

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product {
    constructor(id, data){
      
      const thisProduct = this;
      const thisCart = this;

      thisProduct.id = id;
      thisProduct.data = data;

      
      thisProduct.randerInMenu();
      thisProduct.getElement();
      thisCart.initActions();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
      
      

      // console.log('new Product:', thisProduct);
    }
    randerInMenu(){
      const thisProduct = this;
      /*generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      /*create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /*find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    getElement(){
      
      const thisProduct = this;
      const thisCart = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      
    
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);

      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);

      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);

      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
      
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);

      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);

      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    }

    initAccordion(){
      const thisProduct = this;
      thisProduct.accordionTrigger.addEventListener('click', function(){
        /*prevent default action for element */
        event.preventDefault();
        const parentClickableElement = thisProduct.accordionTrigger.parentElement;
        parentClickableElement.classList.toggle(classNames.menuProduct.wrapperActive);

        /*find active product (product that has active class) */
        const allActiveProducts = document.querySelectorAll(select.all.menuProductsActive);
        // console.log('allActive:', allActiveProduct);

        for(let product of allActiveProducts) {
   
          /* START: if the active product isn't the element of thisProduct */
          if(product != parentClickableElement) {
            /*[DONE] remove class active for the active product */
            product.classList.remove(classNames.menuProduct.wrapperActive);
 
          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }
      });
    }

    initOrderForm(){
      const thisProduct = this;
      //console.log('thisProdct3:',thisProduct);

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();

        thisProduct.processOrder();

      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change',function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }
    processOrder(){
      const thisProduct = this;

      //convert form to object structur
      const formData = utils.serializeFormToObject(thisProduct.form);
      // console.log('formData: ', formData);
      // console.log('thisProduct4:', thisProduct);

      //set price to default price
      let price = thisProduct.data.price;
      // console.log('PRICE', price);

      //for every category(param)...
      for(let paramId in thisProduct.data.params){
        //determine param value e.g. paramId = toppings, param = {label: 'Toppings'
      // type: 'chceckboxes}
        const param = thisProduct.data.params[paramId];
        // console.log(paramId, param);

        //for every option in this category
        for(let optionId in param.options){
          //determine option value
          const option = param.options[optionId];
          // console.log(optionId, option);

          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          // console.log('optionSELECTED: ',optionSelected);
          
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          if(optionImage){
            if(optionSelected){
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            }
            else{
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
              // check if the option is default
                
            }
          }
          
          if (optionSelected) {
   
            // [DONE] check if the option is not default
            if (option.hasOwnProperty('default') != true){
   
              // [DONE] add option price to price variable
              price += option.price;
   
            }
          } else {
   
            // [DONE] check if the option is default
            if(option.hasOwnProperty('default') == true){
   
              // [DONE] reduce price variable
              price -= option.price;
   
            }
          }
        }
      }
      /*multiply price by amount*/
      price *= settings.amountWidget.defaultValue;
      // console.log(price);
      //update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;  
          
            




          
    }
    initAmountWidget(){
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });
      
    }
    initActions(){
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(){
        classNames.cart.wrapperActive.toggle(thisCart.dom.wrapper);
      });
    }
  }

  class AmountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
      thisWidget.announce();
      
      console.log('AmountWidget: ', thisWidget);
      console.log('constructor argument: ', element);
    }
    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    setValue(value){
      const thisWidget = this;
      const newValue = parseInt(value);

      //to do: add validation
      if(settings.amountWidget.defaultValue != newValue && newValue>= settings.amountWidget.defaultMin && newValue<= settings.amountWidget.defaultMax && !isNaN(newValue)){
        settings.amountWidget.defaultValue = newValue;
      }
      
      this.announce();
      thisWidget.input.value = settings.amountWidget.defaultValue;
      // settings.amountWidget.defaultValue
    }
    initActions(){
      const thisWidget = this;
      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
      });

      thisWidget.linkDecrease.addEventListener('click', function(){
        event.preventDefault();
        thisWidget.setValue(settings.amountWidget.defaultValue-1);
      });

      thisWidget.linkIncrease.addEventListener('click', function(){
        event.preventDefault();
        thisWidget.setValue(settings.amountWidget.defaultValue+1);
      });     
    }
    announce(){
      const thisWidget = this;
      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
    
  }
    
  class Cart {
    constructor(element){
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);

      console.log('new Carte: ',thisCart);
    }
    getElements(element){
      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;
    }
  }

  
  const app = {

    initMenu: function(){
      const thisApp = this;
      console.log('this.App.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    // console.log('thisApp.data :', thisApp.data);
    // const testProduct = new Product();
    // console.log('testProduct :', testProduct);
    },
    // const thisApp = this;

    initData: function(){
      const thisApp = this;
  
      thisApp.data = dataSource;
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },
      

      
    init: function(){
      const thisApp = this;
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };  
  
  app.init();
}
