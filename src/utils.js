const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const verifyLine = value => {
  const rgx2 = /(^[0-9]{3}$)|(n[0-9]{2}$)|(^[0-9]{2}$)|[le]-[0-9]$|l[0-9]{2}$/i
  return rgx2.test(value) //zwraca true, jeśli znajdzie szukaną wartość
}

const getColor = value => {
  if(typeof value !== "string"){
    value = String(value)
  }

  const reg1 = /[0-9]{3}/ig
  const reg2 = /[0-9]{2}/ig
  const reg3 = /n[0-9]{2}/ig
  const reg4 = /e-[0-9]{1}/ig

  if(value && reg1.test(value)){
    const two = Number(value.slice(0,2))
    const one = Number(value.slice(2,3))
  
    const two_ = Math.round(Math.abs(Math.sin(two)*360))
    let one_ = Math.round(Math.abs(Math.cos(one)*100))
    one_ = one_ < 50 ? one_ + 30 : one_
    let last = one_ === 100 ? 50 : one_
    last = last < 50 ? last + 30 : last
  
    return `hsl(${two_}, ${one_}%, ${last}%)`
  } else if(value.length === 2 && reg2.test(value)){
      const two = Number(value.slice(0,2))
      const two_ = Math.round(Math.abs(Math.sin(two)*360))
      return `hsl(${two_}, 100%, 30%)`
  } else if(!!value.match(reg3) && !!value){
      let two = Number(value.slice(1,3))
      two = Number(two)
      console.log(two)
      const two_ = Math.round(Math.abs(Math.sin(two)*360))
      return `hsl(${two_}, 30%, 40%)`
  } else if(value && reg4.test(value)){
      const one = Number(value.slice(2,3))
      console.log(one)
      const one_ = Math.round(Math.abs(Math.sin(one)*360))
    return `hsl(${one_}, 40%, 80%)`
  }
}

export {
  validateEmail,
  verifyLine,
  getColor
}
