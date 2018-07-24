const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const verifyLine = value => {
  const rgx2 = /(^[0-9]{3}$)|(n[0-9]{2}$)|(^[0-9]{2}$)|[le]-[0-9]$|l[0-9]{2}$/i
  return rgx2.test(value) //zwraca true, jeśli znajdzie szukaną wartość
}

export {
  validateEmail,
  verifyLine
}
