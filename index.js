const store = {customers: [], meals: [], deliveries: [], employers: []}

let customerId = 0;
class Customer {
  constructor(name, employer) {
    this.id = ++customerId;
    this.name = name;
    if (employer) {
      this.employerId = employer.id;
    }
    store.customers.push(this);
  }
  deliveries() {
    return store.deliveries.filter(function(del) {
      return del.customer() === this
    }.bind(this))
  }
  meals() {
    return this.deliveries().map(function(del) {
      return del.meal();
    })
  }
  totalSpent() {
    return this.meals().reduce(function(accumulator, currentMeal) {
      return accumulator + currentMeal.price;
    }, 0)
  }

}

let mealId = 0;
class Meal {
  constructor(title, price) {
    this.title = title;
    this.price = price;
    this.id = ++mealId;
    store.meals.push(this);
  }
  deliveries() {
    return store.deliveries.filter(function(del) {
      return del.meal() === this
    }.bind(this))
  }
  customers() {
    return this.deliveries().map(function(del) {
      return del.customer();
    })
  }
  static byPrice() {
    const meals = store.meals;
    meals.sort(function(a, b) {
      return b.price - a.price
    })
    return meals;
  }
}

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
  customer() {
    return store.customers.filter(function(cust) {
      return cust.id === this.customerId;
    }.bind(this))[0];
  }
  meal() {
    return store.meals.filter(function(meal) {
      return meal.id === this.mealId;
    }.bind(this))[0];
  }

}

let employerId = 0;
class Employer {
  constructor(name) {
    this.name = name;
    this.id = ++employerId;
    store.employers.push(this);
  }
  employees() {
    return store.customers.filter(function(cust) {
      return cust.employerId === this.id
    }.bind(this))
  }
  deliveries() {
    const employees = this.employees();
    const dels = []
    employees.forEach(function(employee) {
      employee.deliveries().forEach(function(del) {
        dels.push(del);
      })
    })
    return dels;
  }
  meals() {
    const deliveries = this.deliveries();
    const mealsArray = [];
    deliveries.forEach(function(del) {
      if(mealsArray.includes(del.meal()) !== true) {
        mealsArray.push(del.meal());
      }
    })
    return mealsArray;
  }
  allMeals() {
    const deliveries = this.deliveries();
    return deliveries.map(function(del) {
      return del.meal();
    })
  }
  mealTotals() {
    const meals = this.allMeals();
    const answer = {}
    meals.forEach(function(meal) {
      if (answer[meal.id]) {
        answer[meal.id] += 1;
      }
      else {
        answer[meal.id] = 1;
      }
    })

    return answer;
  }

}
