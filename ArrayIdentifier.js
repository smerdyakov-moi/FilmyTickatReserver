//Flatten an array of arrays
const array  = [[1,2,3],[4,5,6],[7,8,9]]
let flattened = array.reduce ((total,value)=>total.concat(value),[])
console.log(flattened)

//Concatenate Strings
const words = ['Hello', 'world', 'this', 'is', 'reduce']
let concatenated = words.reduce ((total,value)=>total.concat(value+" ")," ")
console.log(concatenated)

//Find the Vote Count
const votes = ['yes','no','yes','no','yes','whatever']
let votecount = votes.reduce((accum,vote) => {accum[vote] = (accum[vote]||0)+1; return accum}, {})
console.log(votecount)

//Find the Maximum Number
const numbers = [10,50,300,70,40]
let maxnumber = numbers.reduce ((accum,value) => {
    accum = ((accum>=value)? accum:value)
    return accum
})
console.log(maxnumber)

//Group objects by property
const people = [
  { name: 'Alice', city: 'NY' },
  { name: 'Bob', city: 'LA' },
  { name: 'Charlie', city: 'NY' },
  { name: 'David', city: 'LA' },
  { name: 'Eve', city: 'TX' }
]
  
 let objectedKey = people.reduce ((accum,value)=>{
     accum[value.city] =(accum[value.city]? accum[value.city]:[])
     accum[value.city].push(value)
     return accum
 },{})
console.log(objectedKey)

//Calulate Average
const scores  = [90,80,70,100]
let average = scores.reduce ((accum,value)=>accum+value,0)/scores.length
console.log(average)

//Create a Lookup Object
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]
let lookedUp = users.reduce ((accum,value)=>{
   accum[value.id] = value 
   return accum
},{})
console.log(lookedUp)

//Remove duplicates
const items = [1,2,2,3,4,4,5]
let new_items = items.reduce ((accum,value)=>{
    (accum.findIndex(v => v===value)===-1? accum.push(value):null)
    return accum
},[])
console.log(new_items) 

function primeBefAft(num) {
    const isPrime= num =>{
   for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return true
    }
    let before = num-1,after = num +1
    while(!isPrime(before)){before--}
    while(!isPrime(after)){after++}
    return [before,after]
}


console.log(findSeventhSonsOfSeventhSons({
        name: 'A', gender: 'male', children: [
            {name: 'B', gender: 'male', children: []},
            {name: 'C', gender: 'male', children: []},
            {name: 'D', gender: 'male', children: []},
            {name: 'E', gender: 'female', children: []}, 
            {name: 'F', gender: 'male', children: []},
            {name: 'G', gender: 'male', children: []},
            {name: 'H', gender: 'male', children: [
                {name: 'I', gender: 'male', children: []},
                {name: 'J', gender: 'male', children: []},
                {name: 'K', gender: 'male', children: []},
                {name: 'L', gender: 'male', children: []},
                {name: 'M', gender: 'male', children: []},
                {name: 'N', gender: 'male', children: []},
                {name: 'O', gender: 'male', children: []}
            ]}
        ]}))


//Maximum subarray sum - Warra Bruteforce
var maxSequence = function(arr){
  let sum =[]
  for(let i=0;i<arr.length;i++)
  {
      for(let j=i;j<arr.length;j++)
      {
          let arr_x= arr.slice(i,j+1)
          sum.push(arr_x.reduce((accum, value) => accum += value, 0))
      }
  }
  let maxsum = sum.reduce((accum,value)=> (accum<value? accum=value:accum),0)
  return maxsum
}

//Polydivisible number?
function ispolydivisible(n)
{
    let stringed =n.toString()
    let counter=0   
    while (counter<stringed.length){
        check_string=stringed.slice(0,counter+1)
        if(Number(check_string)%(counter+1)!==0){return false}
        counter+=1
    }
    return true
}
function next(n){
    n+=1
    if(ispolydivisible(n)){return n}
    else{return next(n)}
}

console.log(next(123452))


function solution(a) {
  let outofindex = false
  let currentIndex = a[0]
  let counter = 1
  while (counter<=a.length){
      if(currentIndex>a.length-1){
          return counter
      }
      counter+=1
      currentIndex = currentIndex + a[currentIndex]
      
  }
  return -1
}

//Flatten an array of arrays
const array  = [[1,2,3],[4,5,6],[7,8,9]]
let flattened = array.reduce ((total,value)=>total.concat(value),[])
console.log(flattened)

//Concatenate Strings
const words = ['Hello', 'world', 'this', 'is', 'reduce']
let concatenated = words.reduce ((total,value)=>total.concat(value+" ")," ")
console.log(concatenated)

//Find the Vote Count
const votes = ['yes','no','yes','no','yes','whatever']
let votecount = votes.reduce((accum,vote) => {accum[vote] = (accum[vote]||0)+1; return accum}, {})
console.log(votecount)

//Find the Maximum Number
const numbers = [10,50,300,70,40]
let maxnumber = numbers.reduce ((accum,value) => {
    accum = ((accum>=value)? accum:value)
    return accum
})
console.log(maxnumber)

//Group objects by property
const people = [
  { name: 'Alice', city: 'NY' },
  { name: 'Bob', city: 'LA' },
  { name: 'Charlie', city: 'NY' },
  { name: 'David', city: 'LA' },
  { name: 'Eve', city: 'TX' }
]
  
 let objectedKey = people.reduce ((accum,value)=>{
     accum[value.city] =(accum[value.city]? accum[value.city]:[])
     accum[value.city].push(value)
     return accum
 },{})
console.log(objectedKey)

//Calulate Average
const scores  = [90,80,70,100]
let average = scores.reduce ((accum,value)=>accum+value,0)/scores.length
console.log(average)

//Create a Lookup Object
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]
let lookedUp = users.reduce ((accum,value)=>{
   accum[value.id] = value 
   return accum
},{})
console.log(lookedUp)

//Remove duplicates
const items = [1,2,2,3,4,4,5]
let new_items = items.reduce ((accum,value)=>{
    (accum.findIndex(v => v===value)===-1? accum.push(value):null)
    return accum
},[])
console.log(new_items) 

function primeBefAft(num) {
    const isPrime= num =>{
   for(let i = 2, s = Math.sqrt(num); i <= s; i++) {
        if(num % i === 0) return false;
    }
    return true
    }
    let before = num-1,after = num +1
    while(!isPrime(before)){before--}
    while(!isPrime(after)){after++}
    return [before,after]
}


console.log(findSeventhSonsOfSeventhSons({
        name: 'A', gender: 'male', children: [
            {name: 'B', gender: 'male', children: []},
            {name: 'C', gender: 'male', children: []},
            {name: 'D', gender: 'male', children: []},
            {name: 'E', gender: 'female', children: []}, 
            {name: 'F', gender: 'male', children: []},
            {name: 'G', gender: 'male', children: []},
            {name: 'H', gender: 'male', children: [
                {name: 'I', gender: 'male', children: []},
                {name: 'J', gender: 'male', children: []},
                {name: 'K', gender: 'male', children: []},
                {name: 'L', gender: 'male', children: []},
                {name: 'M', gender: 'male', children: []},
                {name: 'N', gender: 'male', children: []},
                {name: 'O', gender: 'male', children: []}
            ]}
        ]}))


//Maximum subarray sum - Warra Bruteforce
var maxSequence = function(arr){
  let sum =[]
  for(let i=0;i<arr.length;i++)
  {
      for(let j=i;j<arr.length;j++)
      {
          let arr_x= arr.slice(i,j+1)
          sum.push(arr_x.reduce((accum, value) => accum += value, 0))
      }
  }
  let maxsum = sum.reduce((accum,value)=> (accum<value? accum=value:accum),0)
  return maxsum
}

//Polydivisible number?
function ispolydivisible(n)
{
    let stringed =n.toString()
    let counter=0   
    while (counter<stringed.length){
        check_string=stringed.slice(0,counter+1)
        if(Number(check_string)%(counter+1)!==0){return false}
        counter+=1
    }
    return true
}
function next(n){
    n+=1
    if(ispolydivisible(n)){return n}
    else{return next(n)}
}

console.log(next(123452))


function solution(a) {
  let outofindex = false
  let currentIndex = a[0]
  let counter = 1
  while (counter<=a.length){
      if(currentIndex>a.length-1){
          return counter
      }
      counter+=1
      currentIndex = currentIndex + a[currentIndex]
      
  }
  return -1
}