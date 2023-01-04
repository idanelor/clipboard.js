import { promiseConstructor } from "../clipboard-polyfill/globals";

export function promiseRecordMap<T>(
  keys: string[],
  f: (key: string) => Promise<T>,
): Promise<Record<string, T>> {
  var promiseList: Promise<T>[] = [];
  for (var i in keys) {
    var key = keys[i];
    promiseList.push(f(key));
  }
  return promiseConstructor
    .all(promiseList)
    .then(function (vList: T[]): Record<string, T> {
      var dataOut: Record<string, T> = {};
      for (var i = 0; i < keys.length; i++) {
        dataOut[keys[i]] = vList[i];
      }
      return dataOut;
    });
}

export var voidPromise: Promise<void> = promiseConstructor.resolve();
export var truePromiseFn: () => Promise<boolean> = () =>
  promiseConstructor.resolve(true);
export var truePromise: Promise<boolean> = truePromiseFn();
export var falsePromise: Promise<boolean> = promiseConstructor.resolve(false);
