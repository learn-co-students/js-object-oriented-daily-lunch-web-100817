let store = {customers: [], meals: [], employers: [], deliveries: []}

let customerId = 0

class Customer {
  constructor(name, employer) {
    this.name = name
    this.id = ++customerId

    if(employer) {
      this.employerId = employer.id
    }
    store.customers.push(this)
  }

  deliveries() {
    return store.deliveries.filter( del => {
      return del.customerId === this.id
    })
  }

  meals() {
    return this.deliveries().map(del => {
      return del.meal()
    })
  }
  totalSpent(){
    return this.meals().reduce(function(a, b) {
      return a + b.price
    }, 0)
  }
}

let employerId = 0

class Employer {
  constructor(name){
    this.name = name
    this.id = ++employerId

    store.employers.push(this)
  }

  employees(){
    return store.customers.filter(customer => {
      return customer.employerId === this.id
    })
  }

  deliveries(){
    let list = this.employees().map( emp => {
      return emp.deliveries()
    })
    // get an array of arrays so have to flatten
    let dels = [].concat.apply([], list)
    return dels
  }

  meals() {
    let meals = this.deliveries().map( del => {
      return del.meal()
    })
    let non_duplicates = Array.from(new Set(meals))

    return non_duplicates
  }

  mealTotals(){
    let stats = {}
    let meals = this.deliveries().map(del => {
      return del.meal()})

    meals.forEach(function(el) {
      if (stats[el.id]) {
        stats[el.id] += 1
      } else {
        stats[el.id] = 1
      }
    })
    return stats
  }
}

let mealId = 0

class Meal {
  constructor(title, price) {
    this.title = title
    this.price = price
    this.id = ++mealId

    store.meals.push(this)
  }

  deliveries() {
    return store.deliveries.filter( del => {
      return del.mealId === this.id
    })
  }

  customers() {
    return this.deliveries().map(del => {
      return del.customer()
    })
  }

  static byPrice(){
    return store.meals.sort((m1, m2) => {
      return m1.price < m2.price
    })
  }
}

let deliveryId = 0

class Delivery {
  constructor(meal, customer) {
    this.id = ++deliveryId

    if(meal){
      this.mealId = meal.id
    }

    if(customer){
      this.customerId = customer.id
    }

    store.deliveries.push(this)

  }
  meal() {
    return store.meals.find( meal => {
      return meal.id === this.mealId
    })
  }

  customer() {
    return store.customers.find( customer => {
      return customer.id === this.customerId
    })
  }
}
