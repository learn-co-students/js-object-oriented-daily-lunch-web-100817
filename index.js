let customersId = 0;
let mealsId = 0;
let deliveriesId = 0;
let employersId = 0;

const store = {
  customers: [],
  meals: [],
  deliveries: [],
  employers: []
}

class Customer {
  constructor(name, employer) {
    this.id = ++customersId;
    this.name = name;
    if (employer) {
      this.employerId = employer.id;
    }
    store.customers.push(this);
  }

  deliveries() {
    return store.deliveries.filter((delivery) => {
      return delivery.customerId === this.id;
    })
  }

  meals() {
    return this.deliveries().map((delivery) => {
      return store.meals.find((meal) => {
        return delivery.mealId === meal.id;
      })
    })
  }

  totalSpent() {
    return this.meals().reduce((acc, meal) => {
      return acc += meal.price;
    }, 0)
  }
}

class Meal {
  constructor(title, price) {
    this.id = ++mealsId;
    this.title = title;
    this.price = price
    store.meals.push(this);
  }

  deliveries() {
    return store.deliveries.filter((delivery) => {
      return delivery.mealId === this.id;
    })
  }

  customers() {
    return this.deliveries().map((delivery) => {
      return store.customers.find((customer) => {
        return delivery.customerId === customer.id;
      })
    })
  }

  static byPrice() {
    return store.meals.sort((a, b) => {
      return b.price - a.price;
    })
  }
}

class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveriesId;
    if (meal) {
      this.mealId = meal.id;
    }
    if (customer) {
      this.customerId = customer.id;
    }    
    store.deliveries.push(this);
  }

  meal() {
    return store.meals.find((meal) => {
      return meal.id === this.mealId;
    })
  }

  customer() {
    return store.customers.find((customer) => {
      return customer.id === this.customerId;
    })
  }
}

class Employer {
  constructor(name) {
    this.id = ++employersId;
    this.name = name;
    store.employers.push(this);
  }

  employees() {
    return store.customers.filter((customer) => {
      return customer.employerId === this.id;
    })
  }

  deliveries() {
    return this.employees().reduce((acc, employee) => {
      return acc.concat(employee.deliveries());
    }, [])
  }

  meals() {
    return this.employees().reduce((acc, employee) => {
      let meals = employee.meals();
      let arr = [];
      for (const meal of meals) {
        if (!acc.includes(meal)) {
          arr.push(meal);
        }
      }
      return acc.concat(arr);
    }, [])
  }

  mealTotals() {
    // mealTotals() - returns a JavaScript object displaying each respective meal id ordered by the employer's employees. The keys of the JavaScript object are the meal ids and associated with each meal id is a value. For example, employerOne.mealTotals() returning an object of {1: 4, 2: 3} would mean that the meal with id of 1 was ordered by employerOne's employees four times, and the meal with id of 2 was ordered by employerOne's employees three times.
    return this.employees().reduce((acc, employee) => {
      let meals = employee.meals();
      for (const meal of meals) {
        if (acc[meal.id]) {
          acc[meal.id]++;
        } else {
          acc[meal.id] = 1;
        }
      }
      return acc;
    }, {})
  }
}