const hoge = async () => {
  return 'This is hoge'
}
console.log(hoge())

const a = {
  ...{
    A: 1
  },
  ...{
    B: 2,
  }
}
