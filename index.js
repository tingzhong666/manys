/**
 * @return Promise 承诺
 *        resolve 时，传入每个异步操作传入 resolve 的数据数组
 *        reject 时，传入错误对象
 * @param {Array} arr 进行异步并发操作的数组
 * @param {Number} n 最大并发数
 * @param {callback} callback(value, resolve, reject) 对数组中每个元素进行的异步操作 回调函数
 *                   value  遍历数组的元素
 *                   resolve 返回承诺状态，传入resolve的参数，会在所有异步并发结束后，传入 .then 的回调参数
 *                   reject 返回承诺状态，传入的参数，会在所有异步操作结束后，传入 .catch 的回调参数
 */
function manys (arr, n, callback) {
  return new Promise((resolve, reject) => {
    // 多线程统一数据存放
    let list = [];
    // 正在运行的线程数
    let thread = 0;
    // 队列
    let length = 0;

    // 单线程异步
    function queues (arr, callback) {
      return new Promise((resolve, reject) => {
        // 单线程数据存放
        let datas = [];
        // 队列异步处理操作
        function queue (arr, callback) {
          // 当前处理的队列
          let l = ++ length;
          return new Promise((resolve, reject) => {
            // 当前队列是否大于数组的长度
            if (l < arr.length) {

              // 回调函数进行 Promise 实例化
              let call = new Promise((resolve, reject) => {
                callback(arr[l-1], resolve, reject);
              })

              // 当实例返回 resolve 时，也就是这个队列的异步任务处理完成，递归进入下一个队列，
              call.then((data)=> {
                // 将数据存入当前线程的数据存放数组中
                datas.push(data);
                // 输出队列进度
                console.log('...' + l);
                return queue(arr, callback).then(() => resolve()).catch(err => reject(err));
              })
              .catch(err => reject(err));

 
            }
            // 当队列数大于数组长度时，返回 resolve ，不再进行递归
            else {
              resolve();
            }

          });
      
        }
      
        // 启动异步队列操作，队列处理完，返回 承诺和数据
        queue(arr, callback).then(() => resolve(datas)).catch(err => reject(err));
      });
    }

    // 多线程创建
    for (let i = 0; i < n; i ++) {
      thread++;
      queues(arr, callback)
                .then(data => {
                  list = list.concat(data);
                  thread--;
                  if (thread === 0) {
                    resolve(list);
                  }
                })
                .catch(err => reject(err));
    }

  });
}

module.exports = manys;