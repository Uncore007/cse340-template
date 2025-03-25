const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li class="vehicle-card">'
        grid += '<div class="vehicle-card-inner">'
        // Image container with consistent aspect ratio
        grid += '<div class="vehicle-image-container">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '</div>'
        
        // Vehicle info section
        grid += '<div class="vehicle-info">'
        grid += '<h3>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h3>'
        grid += '<div class="vehicle-year">' + vehicle.inv_year + '</div>'
        grid += '<div class="vehicle-price">$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</div>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id 
        + '" class="view-vehicle-btn">View Details</a>'
        grid += '</div>'
        
        grid += '</div>' // Close vehicle-card-inner
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildInventoryView = async function(data){
  let grid
  if(data !== undefined){
    grid = '<div id="vehicle-details">'
    
    grid += '<div class="inv-row">'
    grid += '<div class="inv-image-col">'
    grid += '<img class="inv-image" src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + ' on CSE Motors" />'
    grid += '</div>'
    
    grid += '<div class="inv-details-col">'
    grid += '<div class="price-banner">$' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</div>'
    
    grid += '<div class="details-box">'
    grid += '<h3>Vehicle Details</h3>'
    grid += '<ul class="vehicle-specs">'
    grid += '<li><span>Make:</span> ' + data.inv_make + '</li>'
    grid += '<li><span>Model:</span> ' + data.inv_model + '</li>'
    grid += '<li><span>Year:</span> ' + data.inv_year + '</li>'
    grid += '<li><span>Color:</span> ' + data.inv_color + '</li>'
    grid += '<li><span>Mileage:</span> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + ' miles</li>'
    grid += '<li><span>Body:</span> ' + data.classification_name + '</li>'
    grid += '</ul>'
    grid += '</div>'
    
    grid += '<div class="cta-container">'
    grid += '<a href="#" class="dealer-cta">Contact Dealer</a>'
    grid += '<a href="#" class="test-drive-cta">Schedule Test Drive</a>'
    grid += '</div>'
    
    grid += '</div>'
    grid += '</div>'
    
    grid += '<div class="description-section">'
    grid += '<h3>Vehicle Description</h3>'
    grid += '<p>' + data.inv_description + '</p>'
    grid += '</div>'
    
    grid += '</div>'
  } else {
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

Util.buildLoginGrid = async function(){
  let grid = '<div class="login-form">'
  grid += '<h2>Login</h2>'
  grid += '<form action="/account/login" method="post">'
  grid += '<div class="form-group">'
  grid += '<label for="username">Username</label>'
  grid += '<input type="text" name="username" id="username" required />'
  grid += '</div>'
  grid += '<div class="form-group">'
  grid += '<label for="password">Password</label>'
  grid += '<input type="password" name="password" id="password" required />'
  grid += '</div>'
  grid += '<button type="submit">Login</button>'
  grid += '</form>'
  grid += '<a href="/account/register" class="register-link">Register</a>'
  grid += '</div>'
  return grid
}

Util.buildRegisterGrid = async function(){
  let grid = '<div class="login-form">'
  grid += '<h2>Register</h2>'
  grid += '<form action="/account/register" method="post">'
  
  // First name field
  grid += '<div class="form-group">'
  grid += '<label for="first_name">First Name</label>'
  grid += '<input type="text" name="first_name" id="first_name" required />'
  grid += '</div>'
  
  // Last name field
  grid += '<div class="form-group">'
  grid += '<label for="last_name">Last Name</label>'
  grid += '<input type="text" name="last_name" id="last_name" required />'
  grid += '</div>'
  
  // Email field
  grid += '<div class="form-group">'
  grid += '<label for="email">Email Address</label>'
  grid += '<input type="email" name="email" id="email" required />'
  grid += '</div>'
  
  // Password field
  grid += '<div class="form-group">'
  grid += '<label for="password">Password</label>'
  grid += '<input type="password" name="password" id="password" required />'
  grid += '</div>'
  
  // Password requirements
  grid += '<div class="password-requirements">'
  grid += '<p>Password requirements:</p>'
  grid += '<ul>'
  grid += '<li>12 characters in length, minimum</li>'
  grid += '<li>Contain at least 1 capital letter</li>'
  grid += '<li>Contain at least 1 number</li>'
  grid += '<li>Contain at least 1 special character</li>'
  grid += '</ul>'
  grid += '</div>'
  
  grid += '<button type="submit">Register</button>'
  grid += '</form>'
  grid += '<a href="/account/login" class="register-link">Login</a>'
  grid += '</div>'
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util