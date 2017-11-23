
let store = {customers: [], employers: [], deliveries: [], meals: []}
let customerId = 0
let employerId = 0
let mealId = 0
let deliveryId = 0

class Meal {
  constructor(title, price) {
    this.id = ++mealId
    this.title = title
    this.price = price
    store.meals.push(this)
  }

  deliveries(){
    debugger;
    return store.deliveries.filter(delivery => {
      return delivery.mealId === this.id
    })
  }

  customers(){
    return this.deliveries().map(delivery => {
      return delivery.customer()
    })
  }

  static byPrice() {
    return store.meals.sort(function (a,b) {
      return b.price - a.price
    })
  }
}

class Customer {
  constructor(name, employer) {
    this.id = ++ customerId
    this.name = name
    if(employer) {
      this.employerId = employer.id
    }
    store.customers.push(this)
  }

  deliveries() {
    return store.deliveries.filter(delivery => {
      return delivery.customerId === this.id
    })
  }

  meals() {
    return this.deliveries().map(delivery => {
      return delivery.meal();
    })
  }

  totalSpent() {
    return this.meals().reduce(function (total, meal) {
      return meal.price + total;
    }, 0);
  }
}

class Delivery {
  constructor(meal, customer) {
    this.id = ++ deliveryId
    if(meal) {
      this.mealId = meal.id
    }
    if(customer) {
      this.customerId = customer.id
    }
    store.deliveries.push(this)
  }

  meal() {
    return store.meals.find(meal => {
      return meal.id === this.mealId
    })
  }

  customer() {
    return store.customers.find(customer => {
      return customer.id === this.customerId
    })
  }
}

class Employer {
  constructor(name) {
    this.id = ++ employerId
    this.name = name
    store.employers.push(this)
  }

  employees() {
    return store.customers.filter(customer => {
      return customer.employerId === this.id
    })
  }

  deliveries() {
    let arr = this.employees().map(customer => {
      return customer.deliveries();
    });
    return [].concat.apply([], arr);
  }

  meals() {
    let arr = this.deliveries().map(delivery => {
      return delivery.meal();
    });
    let newVal = [].concat.apply([], arr);
    let newestVal = [...new Set(newVal)];
    return newestVal;
  }

  mealTotals() {
    let objectIs = {}
    let arr = this.deliveries().map(delivery => {
      return delivery.meal()
    });
    let newArr = [].concat.apply([], arr);
     newArr.forEach(function (meal) {
      if (objectIs[meal.id]) {
        objectIs[meal.id] += 1
      } else {
        objectIs[meal.id] = 1
      }
    })
    return objectIs;
  }
}
