// 函数可以被用作：返回值、参数、属性，所以称为一等公民
// 略

// this的本质: 普通函数而言是caller，箭头函数而言是定义时的上下文this
// this：普通函数和箭头函数的区别
globalThis.id = 99;
const obj = {
  id: "obj",
  foo: function () {
    console.log(this.id); // 'obj'
  },
  bar: () => {
    console.log(this?.id); // nodejs:undefined; chrome:99
    console.log(globalThis?.id); // 99
    console.log(globalThis === this); // nodejs:false; chrome:true
  },
};
obj.foo();
obj.bar();
console.log("======");

function fn() {
  const id = "fn";
  const foo = function () {
    console.log(this?.id); // nodejs:undefined; chrome:99
  };
  const bar = () => {
    console.log(this?.id); // nodejs:undefined; chrome:99
    console.log(globalThis?.id); // 99
    console.log(globalThis === this); // nodejs:false; chrome:true
  };
  foo();
  bar();
}
fn();

// 原型的本质：是（对在属性查找中查询另一个对象的）隐式引用
// 原型：普通函数和箭头函数的区别
