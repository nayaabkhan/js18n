export default function forEachObject(object, iterator, receiver) {
  for (var k in object) {
    if (hasOwnProperty.call(object, k)) {
      if (receiver == null) {
        iterator(object[k], k, object)
      } else {
        iterator.call(receiver, object[k], k, object)
      }
    }
  }
}
