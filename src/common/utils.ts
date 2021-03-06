export function round(num: number, dec: number) {
  if(typeof dec=='undefined' || dec<0) dec = 2;

  let tmp = dec + 1;
  for(var i=1; i<=tmp; i++)
    num = num * 10;

  num = num / 10;
  num = Math.round(num);

  for(var i=1; i<=dec; i++)
    num = num / 10;


  const strNumber = num.toFixed(dec);
  //console.log(num)
  var n = strNumber.search(".");
  strNumber.substr(n+2);
  return Number(strNumber);
}
export const decimales:number = 2;
