// interface Array {
//   sortBy(): Array;
//   }

//  Array.prototype.sortBy = function ( p, asc = true) {
//   return this.slice(0).sort(function (a, b) {
//     var x = a[p].toLowerCase();
//     var y = b[p].toLowerCase();
//     if (asc) {
//       return (x > y) ? 1 : (x < y) ? -1 : 0;
//     }
//     return (x > y) ? -1 : (x < y) ? 1 : 0;
//   });
// }