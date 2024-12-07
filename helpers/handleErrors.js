const handleErrors = (err) => {
  let errorResp = {errors : {}};

  if(err.code === 11000){
    errorResp.errors.email = "Email already exists";
    return errorResp;
  }
  
  if(err.errors){
    Object.values(err.errors).map((err) => {
      errorResp.errors[err.properties.path] = err.properties.message;
    });
  }

  if(err.message == "Incorrect email"){
    errorResp.errors.email = "This email is not registered";
  }

  if(err.message == "Incorrect password"){
    errorResp.errors.password = "Incorrect password";
  }

  return errorResp;
}

module.exports ={ handleErrors };