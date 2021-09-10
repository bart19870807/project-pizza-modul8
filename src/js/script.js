/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

// const { utils } = require('stylelint');

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data){
      
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      
      thisProduct.randerInMenu();
      thisProduct.getElement();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
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

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      
    
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);

      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);

      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);

      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    }

    initAccordeon(){
      const thisProduct = this;
      thisProduct.accordionTrigger.addEventListener('click',function(event){
        /*prevent default action for element */
        event.preventDefault();

        /*find active product (product that has active class) */
        const allActiveProduct = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
        console.log('allActive:', allActiveProduct);

        for(let singleActiveProduct of allActiveProduct){
          singleActiveProduct.addEventListener('click', function(){
            if(allActiveProduct !== thisProduct.element){
              thisProduct.element.classList.toggle('active');
            }
          });
        }
      });
    }

    initOrderForm(){
      const thisProduct = this;
      console.log('thisProdct3:',thisProduct);

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
                  optionImage.classList.remove('active');
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
        //update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;  
          
            




          
        }
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
      

      
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };  
  
  app.init();
}
