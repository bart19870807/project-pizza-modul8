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
    constructor(id, date){
      
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.date = date;

      
      thisProduct.randerInMenu();
      thisProduct.initAccordeon();

      console.log('new Product:', thisProduct);
    }
    randerInMenu(){
      const thisProduct = this;
      /*generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.date);
      /*create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /*find menu container */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }

    initAccordeon(){
      const thisProduct = this;
      console.log("thisProduct2 :", thisProduct);
      /*find the clickable trigger (the elemnt that should react to clicking) */
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      console.log('clickableTrigger:', clickableTrigger);
      /*START: add event listener to clickable trigger on event click */


      /*prevent default action for element */
      // element.preventDefault();

      /*find active product (product that has active class) */
      const allActiveProduct = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
      console.log('allActive:', allActiveProduct);
      
      for(allActiveProducts of allActiveProduct){
        allActiveProducts.addEventListener('click', function(){
          if(allActiveProduct !== thisProduct.element){
            thisProduct.element.classList.toggle('active');
          }
        })
      }
      
      /*if there is active product and it's not thisProduct.element, remove class active from it */

      /*toggle active class on thisProduct.element */

    }
  }

  const app = {

    initMenu: function(){
      const thisApp = this;
      console.log('this.App.date:', thisApp.date);

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
