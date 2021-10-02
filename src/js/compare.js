class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      thisWidget.getElements(element);
 
      thisWidget.maxValue = settings.amountWidget.defaultMax;
      thisWidget.minValue = settings.amountWidget.defaultMin;
 
      thisWidget.input.value = parseInt(thisWidget.input.value) ? thisWidget.input.value : thisWidget.minValue;
      //console.log('thisWidget.value', thisWidget.value);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
 
      //console.log('AmountWidget:', thisWidget);
      //console.log('constructor arguments:', element);
    }
 
    setValue(value) {
      const thisWidget = this;
 
      const newValue = parseInt(value);
 
      /* [DONE] TODO: Add Validation */
      if(thisWidget.value != newValue && newValue >= thisWidget.minValue && newValue <= thisWidget.maxValue) {
        thisWidget.value = newValue;
        thisWidget.announce();
      }
 
      thisWidget.input.value = thisWidget.value;
    }
 
    initActions() {
      const thisWidget = this;
 
      thisWidget.input.addEventListener('change', function(){
        thisWidget.setValue(thisWidget.input.value);
      });
 
      thisWidget.linkDecrease.addEventListener('click', function(){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
 
      thisWidget.linkIncrease.addEventListener('click', function(){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
 
    }
 
    announce() {
      const thisWidget = this;
 
      const event = new CustomEvent('update', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
 
    getElements(element){
      const thisWidget = this;
 
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
      thisWidget.maxValue = thisWidget.input.getAttribute(select.widgets.amount.max);
      thisWidget.minValue = thisWidget.input.getAttribute(select.widgets.amount.min);
    }
 
  }