let store = {deliveries: [], meals: [], employers: [], customers: []};

let deliveryId = 0;

class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId;
    if (meal) {
      this.mealId = meal.id;
    }
    if (customer) {
      this.customerId = customer.id;
    }
    store.deliveries.push(this);
  }

  meal(){
    return store.meals.find(m => m.id === this.mealId)
  };

  customer(){
    return store.customers.find(c => c.id === this.customerId);
  };
}

let mealId = 0;

class Meal {
  constructor(name, price) {
    this.id = ++mealId;
    this.title = name;
    this.price = price;
    // debugger;
    store.meals.push(this);
  }

  static byPrice(){
    return store.meals.sort((a,b) => b.price - a.price);
  };

  deliveries(){
    return store.deliveries.filter(d => d.mealId === this.id);
  };

  customers(){
    return this.deliveries().map(d => d.customer());
  };
}

let employerId = 1;

class Employer {
  constructor(name) {
    this.name = name;
    this.id = employerId++;
    store.employers.push(this);
  }

  employees(){
    return store.customers.filter(c => c.employerId === this.id)
  }

  deliveries(){
    let d = [];
    // debugger;
    this.employees().forEach(function(e) {
      d = d.concat(e.deliveries());
    })
    return d;
  }

  meals(){
    return this.deliveries().map(d => d.meal()).filter((m, i, a) => i === a.indexOf(m))
  };

  mealTotals() {
      let stats = {};
      // debugger;
      this.deliveries().forEach(d => {stats[d.meal().id] ? stats[d.meal().id]++ : stats[d.meal().id] = 1})
      return stats;
    }

}

let customerId = 0;

class Customer {
  constructor(name, employer) {
    this.name = name;
    if (employer) {
      this.employerId = employer.id;
    }
    this.id = ++customerId;
    store.customers.push(this);
  }

  deliveries(){
    return store.deliveries.filter(d => d.customerId === this.id);
  };

  meals(){
    return this.deliveries().map(d => d.meal())
  };
  totalSpent(){
    return this.meals().reduce(((t, m ) => t + m.price), 0);
  };
}
