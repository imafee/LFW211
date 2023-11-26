export function check_syntax() {
  let obj = {};
  const obj2 = {};
  obj2.a = 1; // 检查不出来,constant变量不能被重新赋值
  obj3.a = 2; // 检查不出来，给不存在的变量赋值
  // letlet obj3 = {}; // 检查出来了，letlet关键词不存在
  // forfor(){} // 检查出来了，forfor关键词不存在
}
