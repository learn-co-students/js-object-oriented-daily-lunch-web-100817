let store ={deliveries:[],drivers:[],meals:[],employers:[],customers:[]};
let deliveryId = 0;
let mealId = 0;
let employerId = 0;
let customerId = 0;

function isVowel(char)
{
  if (char.length == 1)
  {
    return /[aeiou]/.test(char);
  }
}

String.prototype.plural = function () {
	if (this.slice(-1) === 'y') {
		if ( isVowel((this.charAt(this.length - 2))) ) {
			// If the y has a vowel before it (i.e. toys), then you just add the s.
			return this + 's';
		}
		else {
			// If a this ends in y with a consonant before it (fly), you drop the y and add -ies to make it plural.
			return this.slice(0, -1) + 'ies';
		}
	}
	else if (this.substring( this.length - 2) === 'us') {
		// ends in us -> i, needs to preceed the generic 's' rule
		return this.slice(0, -2) + 'i';
	}
	else if (['ch', 'sh'].indexOf(this.substring( this.length - 2)) !== -1 || ['x','s'].indexOf(this.slice(-1)) !== -1) {
	 	// If a this ends in ch, sh, x, s, you add -es to make it plural.
		return this + 'es';
	}
	else {
		// anything else, just add s
		return this + 's';
	}
}

// function deliveries(){
//   let attribute = this.constructor.name.toLowerCase();
//   return store.deliveries.filter(function(delivery){
//     return delivery[attribute + 'Id'] === this.id;
//   }.bind(this))
// }


class Delivery{
  constructor(meal,customer){
    this.id = ++deliveryId;
    meal ? this.mealId = meal.id : null;
    if (customer){
      this.customerId = customer.id
    }
    store.deliveries.push(this);
  }

  static filterBy(object){
  let  attribute = object.constructor.name.toLowerCase()
  let  array = store.deliveries
    return array.slice().filter(function(el){
      if (el[attribute]){
        return el[attribute].id === object.id;
      }
    })
  }


  customer(){
    return store.customers.find(function(customer){
      return customer.id === this.customerId;
    }.bind(this))
  }

  meal(){
    return store.meals.find(function(meal){
      return meal.id === this.mealId;
    }.bind(this))
  }
};


class Meal{
  constructor(title,price){
    this.id = ++mealId;
    this.title = title;
    this.price = price;
    store.meals.push(this);
    // this.deliveries = deliveries();
    }
static byPrice(){
  return store.meals.slice().sort(function(a,b){
    return b.price - a.price;
  })
}

deliveries(){
  return store.deliveries.filter(function(deliver){
    return deliver.mealId == this.id
  }.bind(this))
}

customers(){
  let deliveries = this.deliveries();
  return deliveries.map(function(delivery){
    return delivery.customer();
  })
}

}

class Employer{
  constructor(name){
    this.id = ++employerId;
    this.name = name;
    store.employers.push(this);
  };

  employees(){
    return store.customers.filter(function(customer){
      return customer.employerId === this.id;
    }.bind(this))
  }

  deliveries(){
    // let employees = this.employees();
    // debugger;
    // let results = employees.map(function(employee){
    //   return employee.deliveries()[0];
    // })
    // debugger;
    // return results;
    let allDeliveries = this.employees().map(employee => {
      return employee.deliveries();
    });
    let merged = [].concat.apply([], allDeliveries);
    return merged;
  }

  meals(){
    let deliveries = this.deliveries();
    return Array.from(new Set(deliveries.map(function(delivery){
      return delivery.meal();
    })))
    }

  mealTotals(){
    let deliveries = this.deliveries();
    let results = {}
    deliveries.forEach(function(delivery){
      if (delivery){
        results[delivery.mealId] || (results[delivery.mealId]=0);
        ++results[delivery.mealId]
      }}.bind(this))
    console.log(results)
    // debugger;
    return results
  }

}

class Customer{
  constructor(name,employer){
    this.id = ++customerId;
    this.employerI
    this.name = name;
    employer ? this.employerId = employer.id : null;
    store.customers.push(this);
    // this.deliveries = deliveries.bind(this);
  }


  deliveries(){
    return store.deliveries.filter(function(deliver){
      return deliver.customerId === this.id
    }.bind(this))
  }

  meals(){
    let deliveries = this.deliveries();
    return deliveries.map(function(delivery){
      return delivery.meal();
    })
    }



  totalSpent(){
    let meals = this.meals();
    return meals.reduce(function(total,meal){
      return total + meal.price;
    },0)
    // debugger;

  }
}
